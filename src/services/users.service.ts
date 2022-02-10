import { Prisma } from '@prisma/client'
import { UnprocessableEntity, NotFound } from 'http-errors'
import { hashSync } from 'bcryptjs'
import { plainToClass } from 'class-transformer'
import { sign, verify } from 'jsonwebtoken'
import { CreateUserDto } from '../dtos/users/request/create-user.dto'
import { UpdateUserDto } from '../dtos/users/request/update-user.dto'
import { prisma } from '../prisma'
import { TokenDto } from '../dtos/auths/response/token.dto'
import { PrismaErrorEnum } from '../utils/enums'
import { UserDto } from '../dtos/users/response/user.dto'
import { emitter } from '../events'
import { USER_EMAIL_CONFIRMATION } from '../events/mail.event'
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
    const token = await AuthService.createToken(user.id)

    emitter.emit(USER_EMAIL_CONFIRMATION, {
      email: user.email,
      userUUID: user.uuid,
    })

    return AuthService.generateAccessToken(token.jti)
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

  static generateEmailConfirmationToken(userUUID: string): string {
    const now = new Date().getTime()
    const exp = Math.floor(
      new Date(now).setSeconds(
        parseInt(
          process.env.JWT_EMAIL_CONFIRMATION_EXPIRATION_TIME as string,
          10,
        ),
      ) / 1000,
    )
    const iat = Math.floor(now / 1000)

    return sign(
      {
        sub: userUUID,
        iat,
        exp,
      },
      process.env.JWT_EMAIL_CONFIRMATION_SECRET_KEY as string,
    )
  }

  static async confirmAccount(token: string): Promise<void> {
    let sub

    try {
      ;({ sub } = verify(
        token,
        process.env.JWT_EMAIL_CONFIRMATION_SECRET_KEY as string,
      ))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)

      throw new UnprocessableEntity('Invalid Token')
    }

    const user = await prisma.user.findUnique({
      where: { uuid: sub as string },
      select: { id: true, confirmedAt: true },
      rejectOnNotFound: false,
    })

    if (!user) {
      throw new UnprocessableEntity('Invalid Token')
    }

    if (user.confirmedAt) {
      throw new UnprocessableEntity('Account already confirmed')
    }

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          confirmedAt: new Date(),
        },
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)

      throw new UnprocessableEntity('Invalid Token')
    }
  }
}
