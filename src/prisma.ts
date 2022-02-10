import { PrismaClient } from '@prisma/client'
import { NotFound } from 'http-errors'
import { plural } from 'pluralize'
import snakeCase from 'lodash.snakecase'

export const prisma = new PrismaClient({
  rejectOnNotFound: (error) => new NotFound(error.message),
})

export function clearDatabase(): Promise<void[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const models = Reflect.ownKeys(prisma).filter((key: any) => key[0] !== '_')

  return Promise.all(
    models.map(async (modelKey) => {
      if (typeof modelKey === 'string') {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE test.${plural(snakeCase(modelKey))} CASCADE;`,
        )
      }
    }),
  )
}
