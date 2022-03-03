import { Prisma, PrismaClient, Admin } from '@prisma/client'
import faker from 'faker'
import { hashSync } from 'bcryptjs'
import { AdminRole } from '../enums'
import { AbstractFactory } from './abstract.factory'

type AdminInput = Partial<Prisma.AdminCreateInput>

export class AdminFactory extends AbstractFactory<Admin> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super()
  }

  async make(input: AdminInput = {}): Promise<Admin> {
    return this.prismaClient.admin.create({
      data: {
        ...input,
        fullName:
          input.fullName ??
          faker.name.firstName() + ' ' + faker.name.lastName(),
        role:
          input.role ??
          faker.random.arrayElement([
            AdminRole.MASTER,
            AdminRole.READ,
            AdminRole.WRITE,
          ]),
        email: input.email ?? faker.internet.email(),
        password: hashSync(input.password ?? faker.internet.password(), 10),
      },
    })
  }

  async makeMany(factorial: number, input: AdminInput = {}): Promise<Admin[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)))
  }
}
