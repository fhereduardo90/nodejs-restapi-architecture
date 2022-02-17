import { Admin, AdminRole, PrismaClient } from '@prisma/client'
import { hashSync } from 'bcryptjs'

export default async (prisma: PrismaClient): Promise<Admin[]> => {
  const password = hashSync('Welcome123!', 10)
  const result = []
  result.push(
    prisma.admin.upsert({
      create: {
        role: AdminRole.MASTER,
        email: 'eduardomanrique@ravn.co',
        fullName: 'eduardo de rivero',
        password,
      },
      update: {},
      where: { email: 'eduardomanrique@ravn.co' },
    }),
    prisma.admin.upsert({
      create: {
        role: AdminRole.MASTER,
        email: 'fernando@ravn.co',
        fullName: 'fernando juarez',
        password,
      },
      update: {},
      where: { email: 'fernando@ravn.co' },
    }),
  )
  return Promise.all(result)
}
