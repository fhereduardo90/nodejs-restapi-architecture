import { Prisma, User } from '@prisma/client'
import createError from 'http-errors'
import { CreateUserDto } from '../dtos/users/request/create-user.dto'
import { UpdateUserDto } from '../dtos/users/request/update-user.dto'
import { prisma } from '../server'

export class UsersService {
  static async find(): Promise<User[]> {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  }

  static async create(input: CreateUserDto): Promise<User> {
    if (await prisma.user.count({ where: { email: input.email } })) {
      throw new createError.UnprocessableEntity('email already taken')
    }

    return prisma.user.create({ data: input })
  }

  static async findOne(uuid: string): Promise<User> {
    return prisma.user.findUnique({ where: { uuid } })
  }

  static async update(uuid: string, input: UpdateUserDto): Promise<User> {
    try {
      const user = await prisma.user.update({
        data: input,
        where: {
          uuid,
        },
      })

      return user
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new createError.UnprocessableEntity('email already taken')
        }
      }

      throw error
    }
  }
}
