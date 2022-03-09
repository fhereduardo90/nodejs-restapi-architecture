import { prisma } from '../prisma'

export class TokenService {
  static async prune(): Promise<void> {
    const now = new Date()

    prisma.token
      .deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      })
      .then(console.table)
  }
}
