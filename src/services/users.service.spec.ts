import { User } from '@prisma/client'
import faker from 'faker'
import jwt from 'jsonwebtoken'
import 'jest-extended/all'
import { plainToClass } from 'class-transformer'
import { UnprocessableEntity, NotFound } from 'http-errors'
import { CreateUserDto } from '../dtos/users/request/create-user.dto'
import { clearDatabase, prisma } from '../prisma'
import { UserFactory } from '../utils/factories/user.factory'
import { UpdateUserDto } from '../dtos/users/request/update-user.dto'
import { emitter } from '../events'
import { UsersService } from './users.service'
import { AuthService } from './auth.service'

jest.spyOn(console, 'error').mockImplementation(jest.fn())

describe('UserService', () => {
  let userFactory: UserFactory

  beforeAll(() => {
    userFactory = new UserFactory(prisma)
  })

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await clearDatabase()
    await prisma.$disconnect()
  })

  describe('find', () => {
    beforeAll(async () => {
      await userFactory.makeMany(5)
    })

    it('should return all the created users', async () => {
      const result = await UsersService.find()
      expect(result.length).toBe(5)
    })
  })

  describe('create', () => {
    it('should throw an error if the user already exists', async () => {
      const email = faker.internet.email()
      await userFactory.make({ email })

      const data = plainToClass(CreateUserDto, {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email,
        password: faker.internet.password(6),
      })

      await expect(UsersService.create(data)).rejects.toThrowError(
        new UnprocessableEntity('email already taken'),
      )
    })

    it('should create a new user', async () => {
      const spyCreateToken = jest.spyOn(AuthService, 'createToken')

      const spyEmitter = jest.spyOn(emitter, 'emit')

      const generateAccessToken = jest.spyOn(AuthService, 'generateAccessToken')

      const data = plainToClass(CreateUserDto, {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(6),
      })

      const result = await UsersService.create(data)

      expect(spyCreateToken).toHaveBeenCalledOnce()

      expect(spyEmitter).toHaveBeenCalledOnce()

      expect(generateAccessToken).toHaveBeenCalledOnce()

      expect(result).toHaveProperty('accessToken')
    })
  })

  describe('findOne', () => {
    let user: User
    beforeAll(async () => {
      user = await userFactory.make()
    })

    it('should throw an error if the user does not exist', async () => {
      await expect(
        UsersService.findOne(faker.datatype.uuid()),
      ).rejects.toThrowError(new NotFound('No User found'))
    })

    it('should return the user', async () => {
      const result = await UsersService.findOne(user.uuid)

      expect(result).toBeDefined()
    })
  })

  describe('update', () => {
    beforeAll(() => {
      jest.mock('jsonwebtoken', () => ({
        sign: jest.fn().mockImplementation(() => 'my.jwt.token'),
      }))
    })

    it('should throw an error if the user does not exist', async () => {
      const data = plainToClass(UpdateUserDto, {})

      await expect(
        UsersService.update(faker.datatype.uuid(), data),
      ).rejects.toThrowError(new NotFound('User not found'))
    })

    it('should throw an error if the user tries to update the email with an existing one', async () => {
      const existingEmail = faker.internet.email()
      await userFactory.make({ email: existingEmail })
      const user = await userFactory.make()

      const data = plainToClass(UpdateUserDto, { email: existingEmail })

      await expect(UsersService.update(user.uuid, data)).rejects.toThrowError(
        new UnprocessableEntity('email already taken'),
      )
    })

    it('should update the user', async () => {
      const user = await userFactory.make()
      const firstName = faker.name.firstName()
      const data = plainToClass(UpdateUserDto, { firstName })

      const result = await UsersService.update(user.uuid, data)

      expect(result).toHaveProperty('firstName', firstName)
    })
  })

  describe('generateEmailConfirmationToken', () => {
    it('should return the token for the confirmation', () => {
      const result = UsersService.generateEmailConfirmationToken(
        faker.datatype.uuid(),
      )

      expect(result).toBeString()
    })
  })

  describe('confirmAccount', () => {
    const token = '123.123.123'
    it('should throw an error if the token is invalid', async () => {
      await expect(
        UsersService.confirmAccount(faker.lorem.word()),
      ).rejects.toThrowError(new UnprocessableEntity('Invalid Token'))
    })

    it('should throw an error if the token does not belong to an existing user', async () => {
      jest
        .spyOn(jwt, 'verify')
        .mockImplementation(jest.fn(() => ({ sub: faker.datatype.uuid() })))

      await expect(UsersService.confirmAccount(token)).rejects.toThrowError(
        new UnprocessableEntity('Invalid Token'),
      )
    })

    it('should throw an error if the user was already confirmed before', async () => {
      const userConfirmed = await userFactory.make({
        confirmedAt: faker.datatype.datetime(),
      })
      jest
        .spyOn(jwt, 'verify')
        .mockImplementation(jest.fn(() => ({ sub: userConfirmed.uuid })))

      await expect(UsersService.confirmAccount(token)).rejects.toThrowError(
        new UnprocessableEntity('Account already confirmed'),
      )
    })

    it('should confirm the user account', async () => {
      const user = await userFactory.make()
      jest
        .spyOn(jwt, 'verify')
        .mockImplementation(jest.fn(() => ({ sub: user.uuid })))

      const result = await UsersService.confirmAccount(token)

      expect(result).toBeUndefined()
    })
  })
})
