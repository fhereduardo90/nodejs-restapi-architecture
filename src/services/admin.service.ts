import { Prisma } from '@prisma/client'
import { hashSync } from 'bcryptjs'
import { plainToClass } from 'class-transformer'
import { NotFound, UnprocessableEntity } from 'http-errors'
import { UpdateAdminDto } from '../dtos/admins/request/update-user.dto'
import { AdminDto } from '../dtos/admins/response/admin.dto'
import { prisma } from '../prisma'
import { PrismaErrorEnum } from '../utils/enums'

export class AdminService {
  static async findOne(uuid: string): Promise<AdminDto> {
    const admin = await prisma.admin.findUnique({ where: { uuid } })

    return plainToClass(AdminDto, admin)
  }

  static async update(
    uuid: string,
    { password, ...input }: UpdateAdminDto,
  ): Promise<AdminDto> {
    try {
      const admin = await prisma.admin.update({
        data: {
          ...input,
          ...(password && { password: hashSync(password, 10) }),
        },
        where: {
          uuid,
        },
      })

      return plainToClass(AdminDto, admin)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.NOT_FOUND:
            throw new NotFound('Admin not found')
          case PrismaErrorEnum.DUPLICATED:
            throw new UnprocessableEntity('email already taken')
          default:
            throw error
        }
      }

      throw error
    }
  }
}
