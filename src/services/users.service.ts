import { Prisma } from '@prisma/client'
import { UnprocessableEntity, NotFound } from 'http-errors'
import { hashSync } from 'bcryptjs'
import { plainToClass } from 'class-transformer'
import { CreateUserDto } from '../dtos/users/request/create-user.dto'
import { UpdateUserDto } from '../dtos/users/request/update-user.dto'
import { prisma } from '../server'
import { TokenDto } from '../dtos/auths/response/token.dto'
import { PrismaErrorEnum } from '../utils/enums'
import { UserDto } from '../dtos/users/response/user.dto'
import { AuthService } from './auth.service'

export class UsersService {
  static async find(): Promise<UserDto[]> {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })

    return plainToClass(UserDto, users)
  }

  static async create({
    password,
    ...input
  }: CreateUserDto): Promise<TokenDto> {
    const userFound = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
      rejectOnNotFound: false,
    })

    if (userFound) {
      throw new UnprocessableEntity('email already taken')
    }

    const user = await prisma.user.create({
      data: {
        ...input,
        password: hashSync(password, 10),
      },
    })

    return AuthService.generateAccessToken(user.uuid)
  }

  static async findOne(uuid: string): Promise<UserDto> {
    const user = await prisma.user.findUnique({ where: { uuid } })

    return plainToClass(UserDto, user)
  }

  static async update(
    uuid: string,
    { password, ...input }: UpdateUserDto,
  ): Promise<UserDto> {
    try {
      const user = await prisma.user.update({
        data: {
          ...input,
          ...(password && { password: hashSync(password, 10) }),
        },
        where: {
          uuid,
        },
      })

      return plainToClass(UserDto, user)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.NOT_FOUND:
            throw new NotFound('User not found')
          case PrismaErrorEnum.DUPLICATED:
            throw new UnprocessableEntity('email already taken')
          default:
            throw error
        }
      }

      throw error
    }
  }
}
