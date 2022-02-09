import { Prisma, Token } from '@prisma/client'
import { compareSync } from 'bcryptjs'
import { Unauthorized, NotFound } from 'http-errors'
import jwt from 'jsonwebtoken'
import { LoginDto } from '../dtos/auths/request/login.dto'
import { TokenDto } from '../dtos/auths/response/token.dto'

import { prisma } from '../server'
import { PrismaErrorEnum } from '../utils/enums'

export class AuthService {
  static async login(input: LoginDto): Promise<TokenDto> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      rejectOnNotFound: false,
    })

    if (!user) {
      throw new Unauthorized('invalid credentials')
    }

    const isValid = compareSync(input.password, user.password)

    if (!isValid) {
      throw new Unauthorized('invalid credentials')
    }

    const token = await this.createToken(user.id)

    return this.generateAccessToken(token.jti)
  }

  static async createToken(userId: number): Promise<Token> {
    try {
      const token = await prisma.token.create({
        data: {
          userId,
        },
      })

      return token
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.NOT_FOUND:
            throw new NotFound('User not found')
          default:
            throw error
        }
      }

      throw error
    }
  }

  static async logout(accessToken?: string): Promise<void> {
    if (!accessToken) return

    try {
      const { sub } = jwt.verify(
        accessToken,
        process.env.JWT_SECRET_KEY as string,
      )

      await prisma.token.delete({ where: { jti: sub as string } })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  static generateAccessToken(sub: string): TokenDto {
    const now = new Date().getTime()
    const exp = Math.floor(
      new Date(now).setSeconds(
        parseInt(process.env.JWT_EXPIRATION_TIME || '7200', 10),
      ) / 1000,
    )
    const iat = Math.floor(now / 1000)

    const accessToken = jwt.sign(
      {
        sub,
        iat,
        exp,
      },
      process.env.JWT_SECRET_KEY as string,
    )

    return {
      accessToken,
      exp,
    }
  }
}
