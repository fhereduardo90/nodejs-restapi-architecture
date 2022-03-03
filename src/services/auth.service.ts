import { Admin, Prisma, Token, User } from '@prisma/client'
import { compareSync } from 'bcryptjs'
import { Unauthorized, NotFound, Forbidden } from 'http-errors'
import { verify, sign } from 'jsonwebtoken'
import { LoginDto } from '../dtos/auths/request/login.dto'
import { TokenDto } from '../dtos/auths/response/token.dto'
import { prisma } from '../prisma'
import { AdminRole, PrismaErrorEnum } from '../utils/enums'
import { Authenticated } from '../utils/types'

export class AuthService {
  static async login(input: LoginDto): Promise<TokenDto> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      rejectOnNotFound: false,
    })

    const admin = await prisma.admin.findUnique({
      where: { email: input.email },
      rejectOnNotFound: false,
    })

    const person = user ?? admin

    const type = user ? 'userId' : 'adminId'

    if (!person) {
      throw new Unauthorized('invalid credentials')
    }

    const isValid = compareSync(input.password, person.password)

    if (!isValid) {
      throw new Unauthorized('invalid credentials')
    }

    const token = await this.createToken(person.id, type)

    return this.generateAccessToken(token.jti)
  }

  static async createToken(
    id: number,
    type: 'userId' | 'adminId',
  ): Promise<Token> {
    try {
      const token = await prisma.token.create({
        data: {
          [type]: id,
        },
      })

      return token
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.FOREIGN_KEY_CONSTRAINT:
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
      const { sub } = verify(accessToken, process.env.JWT_SECRET_KEY as string)

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
        parseInt(process.env.JWT_EXPIRATION_TIME as string, 10),
      ) / 1000,
    )
    const iat = Math.floor(now / 1000)

    const accessToken = sign(
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
  static validateUser({ user }: Authenticated<User>): void {
    if (user.type !== 'user') {
      throw new Forbidden(
        'The current user does not have the enough privileges',
      )
    }
  }

  static validateAdmin({ user }: Authenticated<Admin>): void {
    if (user.type !== 'admin') {
      throw new Forbidden(
        'The current user does not have the enough privileges',
      )
    }
  }

  static validateWriteAdmin({ user }: Authenticated<Admin>): void {
    if (user.role !== AdminRole.MASTER && user.role !== AdminRole.WRITE) {
      throw new Forbidden(
        'The current admin does not have the enough privileges',
      )
    }
  }

  static validateSuperAdmin({ user }: Authenticated<Admin>): void {
    if (user.role !== AdminRole.MASTER) {
      throw new Forbidden(
        'The current admin does not have the enough privileges',
      )
    }
  }

  static validateReadAdmin({ user }: Authenticated<Admin>): void {
    if (user.role !== AdminRole.READ && user.role !== AdminRole.MASTER) {
      throw new Forbidden(
        'The current admin does not have the enough privileges',
      )
    }
  }
}
