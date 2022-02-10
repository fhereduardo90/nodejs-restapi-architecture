import { Prisma, PrismaClient, User } from '@prisma/client'
import faker from 'faker'
import { hashSync } from 'bcryptjs'
import { AbstractFactory } from './abstract.factory'

type UserInput = Partial<Prisma.UserCreateInput>

export class UserFactory extends AbstractFactory<User> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super()
  }
  async make(input: UserInput = {}): Promise<User> {
    return this.prismaClient.user.create({
      data: {
        ...input,
        firstName: input.firstName ?? faker.name.firstName(),
        email: input.email ?? faker.internet.email(),
        lastName: input.lastName ?? faker.name.lastName(),
        password: hashSync(input.password ?? faker.internet.password(), 10),
      },
    })
  }
  async makeMany(factorial: number, input: UserInput = {}): Promise<User[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)))
  }
}
