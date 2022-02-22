import { Admin } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import faker from 'faker'
import 'jest-extended/all'
import { NotFound, UnprocessableEntity } from 'http-errors'
import { CreateAdminDto } from '../dtos/admins/request/create-admin.dto'
import { UpdateAdminDto } from '../dtos/admins/request/update-admin.dto'
import { clearDatabase, prisma } from '../prisma'
import { AdminRole } from '../utils/enums'
import { AdminFactory } from '../utils/factories/admin.factory'
import { AdminService } from './admin.service'
import { AuthService } from './auth.service'

jest.spyOn(console, 'error').mockImplementation(jest.fn())

describe('AdminService', () => {
  let adminFactory: AdminFactory
  let admins: Admin[]

  beforeAll(() => {
    adminFactory = new AdminFactory(prisma)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await clearDatabase()
    await prisma.$disconnect()
  })

  describe('find', () => {
    beforeAll(async () => {
      admins = await adminFactory.makeMany(5)
    })

    it('should return all the created admins', async () => {
      const result = await AdminService.find()

      expect(result.length).toBe(admins.length)
    })
  })

  describe('findOne', () => {
    let admin: Admin

    beforeAll(async () => {
      admin = await adminFactory.make()
    })

    it('should throw an error if the admin does not exist', async () => {
      await expect(
        AdminService.findOne(faker.datatype.uuid()),
      ).rejects.toThrowError(new NotFound('No Admin found'))
    })

    it('should return the admin', async () => {
      const result = await AdminService.findOne(admin.uuid)

      expect(result).toHaveProperty('uuid', admin.uuid)
    })
  })

  describe('update', () => {
    beforeAll(() => {
      jest.mock('jsonwebtoken', () => ({
        sign: jest.fn().mockImplementation(() => 'my.jwt.token'),
      }))
    })

    it('should throw an error if the admin does not exist', async () => {
      const data = plainToClass(UpdateAdminDto, {})

      await expect(
        AdminService.update(faker.datatype.uuid(), data),
      ).rejects.toThrowError(new NotFound('Admin not found'))
    })

    it('should throw an error if the admin tries to update the email with an existing one', async () => {
      const existingEmail = faker.internet.email()
      const [admin] = await Promise.all([
        adminFactory.make(),
        adminFactory.make({ email: existingEmail }),
      ])

      const data = plainToClass(UpdateAdminDto, { email: existingEmail })

      await expect(AdminService.update(admin.uuid, data)).rejects.toThrowError(
        new UnprocessableEntity('email already taken'),
      )
    })

    it('should update the admin', async () => {
      const admin = await adminFactory.make()
      const fullName = faker.name.firstName()
      const data = plainToClass(UpdateAdminDto, { fullName })

      const result = await AdminService.update(admin.uuid, data)

      expect(result).toHaveProperty('fullName', fullName)
    })
  })

  describe('create', () => {
    it('should throw an error if the admin already exists', async () => {
      const email = faker.internet.email()
      await adminFactory.make({ email })
      const data = plainToClass(CreateAdminDto, {
        fullName: faker.name.firstName(),
        email,
        password: faker.internet.password(6),
        role: AdminRole.READ,
      })

      await expect(AdminService.create(data)).rejects.toThrowError(
        new UnprocessableEntity('email already taken'),
      )
    })

    it('should create a new admin', async () => {
      const spyCreateToken = jest.spyOn(AuthService, 'createToken')
      const generateAccessToken = jest.spyOn(AuthService, 'generateAccessToken')
      const data = plainToClass(CreateAdminDto, {
        fullName: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(6),
        role: AdminRole.READ,
      })

      const result = await AdminService.create(data)

      expect(spyCreateToken).toHaveBeenCalledOnce()
      expect(generateAccessToken).toHaveBeenCalledOnce()
      expect(result).toHaveProperty('accessToken', expect.any(String))
      expect(result).toHaveProperty('exp', expect.any(Number))
    })
  })

  describe('deleteAdmin', () => {
    let admin: Admin
    beforeAll(async () => {
      admin = await adminFactory.make()
    })

    it('should throw an error if the admin does not exist', async () => {
      await expect(
        AdminService.deleteAdmin(faker.datatype.uuid()),
      ).rejects.toThrowError(new NotFound('No Admin found'))
    })

    it('should delete the admin', async () => {
      const result = await AdminService.deleteAdmin(admin.uuid)

      expect(result).toBeUndefined()
    })
  })
})
