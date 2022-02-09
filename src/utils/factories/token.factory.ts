import { Prisma, PrismaClient, Token } from '@prisma/client'
import { AbstractFactory } from './abstract.factory'

type TokenInput = Prisma.TokenCreateInput

export class TokenFactory extends AbstractFactory<Token> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super()
  }
  async make(input: TokenInput): Promise<Token> {
    return this.prismaClient.token.create({
      data: {
        ...input,
      },
    })
  }
  async makeMany(factorial: number, input: TokenInput): Promise<Token[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)))
  }
}
