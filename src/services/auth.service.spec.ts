import { plainToClass } from 'class-transformer'
import faker from 'faker'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { Unauthorized, NotFound } from 'http-errors'
import { LoginDto } from '../dtos/auths/request/login.dto'
import { clearDatabase, prisma } from '../prisma'
import { UserFactory } from '../utils/factories/user.factory'
import { TokenFactory } from '../utils/factories/token.factory'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let userFactory: UserFactory
  let tokenFactory: TokenFactory

  beforeAll(() => {
    userFactory = new UserFactory(prisma)
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
        AuthService.createToken(faker.datatype.number()),
      ).rejects.toThrowError(new NotFound('User not found'))
    })

    it('should create the token', async () => {
      const user = await userFactory.make()
      const result = await AuthService.createToken(user.id)

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
})
