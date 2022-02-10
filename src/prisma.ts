import { PrismaClient } from '@prisma/client'
import { NotFound } from 'http-errors'

export const prisma = new PrismaClient({
  rejectOnNotFound: (error) => new NotFound(error.message),
})

export async function clearDatabase(): Promise<void> {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" CASCADE;`,
        )
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error({ error })
      }
    }
  }
}
