import { PrismaClient } from '@prisma/client'

export abstract class AbstractFactory<T> {
  protected abstract readonly prismaClient: PrismaClient

  abstract make(input?: unknown): Promise<T>
  abstract makeMany(factorial: number, input: unknown): Promise<T[]>
}
