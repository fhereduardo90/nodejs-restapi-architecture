import { plainToClass } from 'class-transformer'
import faker from 'faker'
import 'jest-extended/all'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { Unauthorized, NotFound, Forbidden } from 'http-errors'
import { Admin, User } from '@prisma/client'
import { LoginDto } from '../dtos/auths/request/login.dto'
import { clearDatabase, prisma } from '../prisma'
import { UserFactory } from '../utils/factories/user.factory'
import { TokenFactory } from '../utils/factories/token.factory'
import { Authenticated } from '../utils/types'
import { AdminFactory } from '../utils/factories/admin.factory'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let userFactory: UserFactory
  let adminFactory: AdminFactory
  let tokenFactory: TokenFactory

  beforeAll(() => {
    userFactory = new UserFactory(prisma)
    adminFactory = new AdminFactory(prisma)
    tokenFactory = new TokenFactory(prisma)
  })

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await clearDatabase()
    await prisma.$disconnect()
  })

  describe('login', () => {
    let userPassword: string
    let userEmail: string

    beforeAll(() => {
      userPassword = faker.internet.password(6)
      userEmail = faker.internet.email()
    })

    it('should throw an error if the user does not exist', async () => {
      const data = plainToClass(LoginDto, {
        email: faker.internet.email(),
        password: faker.internet.password(6),
      })

      await expect(AuthService.login(data)).rejects.toThrowError(
        new Unauthorized('invalid credentials'),
      )
    })

    it('should throw an error if the user password was incorrect', async () => {
      await userFactory.make({ password: userPassword, email: userEmail })

      const data = plainToClass(LoginDto, {
        email: userEmail,
        password: faker.internet.password(6),
      })

      await expect(AuthService.login(data)).rejects.toThrowError(
        new Unauthorized('invalid credentials'),
      )
    })

    it('should create the token for the user', async () => {
      const data = plainToClass(LoginDto, {
        email: userEmail,
        password: userPassword,
      })

      const result = await AuthService.login(data)

      expect(result).toHaveProperty('accessToken')
    })
  })

  describe('createToken', () => {
    it('should throw an error if the user does not exist', async () => {
      await expect(
        AuthService.createToken(faker.datatype.number(), 'userId'),
      ).rejects.toThrowError(new NotFound('User not found'))
    })

    it('should create the token', async () => {
      const user = await userFactory.make()
      const result = await AuthService.createToken(user.id, 'userId')

      expect(result).toHaveProperty('userId', user.id)
    })
  })

  describe('logout', () => {
    it('should return if the token was not provided', async () => {
      const result = await AuthService.logout()

      expect(result).toBeUndefined()
    })

    it('should throw an error if the token was invalid', async () => {
      const spyConsole = jest
        .spyOn(console, 'error')
        .mockImplementation(jest.fn())

      await AuthService.logout(faker.lorem.word())

      expect(spyConsole).toBeCalledWith(new JsonWebTokenError('jwt malformed'))
    })

    it('should delete the token', async () => {
      const token = await tokenFactory.make({
        user: { connect: { id: (await userFactory.make()).id } },
      })

      jest
        .spyOn(jwt, 'verify')
        .mockImplementation(jest.fn(() => ({ sub: token.jti })))

      const result = await AuthService.logout(faker.lorem.word())

      expect(result).toBeUndefined()
    })
  })

  describe('generateAccessToken', () => {
    it('should generate a token', async () => {
      jest.spyOn(jwt, 'sign').mockImplementation(jest.fn(() => '123.123.123'))

      const result = AuthService.generateAccessToken(faker.lorem.word())

      expect(result).toHaveProperty('accessToken', '123.123.123')
    })
  })

  describe('validateUser', () => {
    let user: User

    beforeAll(async () => {
      user = await userFactory.make()
    })

    it('should accept if the user was an user', () => {
      const data: Authenticated<User> = { user: { ...user, type: 'user' } }

      expect(AuthService.validateUser(data)).toBeUndefined()
    })

    it("should throw an error if the user wasn't exists", async () => {
      const data: Authenticated<User> = {
        user: { ...user, type: 'admin' },
      }

      expect(() => AuthService.validateUser(data)).toThrowError(
        new Forbidden('The current user does not have the enough privileges'),
      )
    })
  })

  describe('validateAdmin', () => {
    let admin: Admin

    beforeAll(async () => {
      admin = await adminFactory.make()
    })

    it('should accept if the user was an admin', () => {
      const data: Authenticated<Admin> = { user: { ...admin, type: 'admin' } }

      expect(AuthService.validateAdmin(data)).toBeUndefined()
    })

    it("should throw an error if the user wasn't an admin", async () => {
      admin = await adminFactory.make({ role: 'READ' })
      const data: Authenticated<Admin> = { user: { ...admin, type: 'user' } }

      expect(() => AuthService.validateAdmin(data)).toThrowError(
        new Forbidden('The current user does not have the enough privileges'),
      )
    })
  })

  describe('validateWriteAdmin', () => {
    let admin: Admin

    it('should accept if the user was an super admin', async () => {
      admin = await adminFactory.make({ role: 'MASTER' })
      const data: Authenticated<Admin> = { user: { ...admin, type: 'admin' } }

      expect(AuthService.validateWriteAdmin(data)).toBeUndefined()
    })

    it('should accept if the user was an writer admin', async () => {
      admin = await adminFactory.make({ role: 'WRITE' })
      const data: Authenticated<Admin> = { user: { ...admin, type: 'admin' } }

      expect(AuthService.validateWriteAdmin(data)).toBeUndefined()
    })

    it("should throw an error if the user wasn't an writer admin", async () => {
      admin = await adminFactory.make({ role: 'READ' })
      const data: Authenticated<Admin> = { user: { ...admin, type: 'admin' } }

      expect(() => AuthService.validateWriteAdmin(data)).toThrowError(
        new Forbidden('The current admin does not have the enough privileges'),
      )
    })
  })

  describe('validateSuperAdmin', () => {
    let admin: Admin

    it('should accept if the user was an super admin', async () => {
      admin = await adminFactory.make({ role: 'MASTER' })
      const data: Authenticated<Admin> = { user: { ...admin, type: 'admin' } }

      expect(AuthService.validateSuperAdmin(data)).toBeUndefined()
    })

    it("should throw an error if the user wasn't an super admin", async () => {
      admin = await adminFactory.make({ role: 'READ' })
      const data: Authenticated<Admin> = { user: { ...admin, type: 'admin' } }

      expect(() => AuthService.validateSuperAdmin(data)).toThrowError(
        new Forbidden('The current admin does not have the enough privileges'),
      )
    })
  })

  describe('validateReadAdmin', () => {
    let admin: Admin

    it('should accept if the user was an read admin', async () => {
      admin = await adminFactory.make({ role: 'READ' })
      const data: Authenticated<Admin> = { user: { ...admin, type: 'admin' } }

      expect(AuthService.validateReadAdmin(data)).toBeUndefined()
    })

    it("should throw an error if the user wasn't an read admin", async () => {
      admin = await adminFactory.make({ role: 'WRITE' })
      const data: Authenticated<Admin> = { user: { ...admin, type: 'admin' } }

      expect(() => AuthService.validateReadAdmin(data)).toThrowError(
        new Forbidden('The current admin does not have the enough privileges'),
      )
    })
  })
})
