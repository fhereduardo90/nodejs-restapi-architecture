import { compareSync } from 'bcryptjs'
import { Unauthorized } from 'http-errors'
import jwt from 'jsonwebtoken'
import { LoginDto } from '../dtos/auths/request/login.dto'
import { TokenDto } from '../dtos/auths/response/token.dto'

import { prisma } from '../server'

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

    return this.generateAccessToken(user.uuid)
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
