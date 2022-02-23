import { Prisma } from '@prisma/client'
import { hashSync } from 'bcryptjs'
import { plainToClass } from 'class-transformer'
import { NotFound, UnprocessableEntity } from 'http-errors'
import { CreateAdminDto } from '../dtos/admins/request/create-admin.dto'
import { UpdateAdminDto } from '../dtos/admins/request/update-admin.dto'
import { AdminDto } from '../dtos/admins/response/admin.dto'
import { TokenDto } from '../dtos/auths/response/token.dto'
import { prisma } from '../prisma'
import { PrismaErrorEnum } from '../utils/enums'
import { AuthService } from './auth.service'

export class AdminService {
  static async find(): Promise<AdminDto[]> {
    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return plainToClass(AdminDto, admins)
  }

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

  static async create({
    password,
    ...input
  }: CreateAdminDto): Promise<TokenDto> {
    const adminFound = await prisma.admin.findUnique({
      where: { email: input.email },
      select: { id: true },
      rejectOnNotFound: false,
    })

    if (adminFound) {
      throw new UnprocessableEntity('email already taken')
    }

    const admin = await prisma.admin.create({
      data: {
        ...input,
        password: hashSync(password, 10),
      },
    })
    const token = await AuthService.createToken(admin.id, 'adminId')

    return AuthService.generateAccessToken(token.jti)
  }

  static async deleteAdmin(uuid: string): Promise<AdminDto> {
    const admin = await prisma.admin.delete({ where: { uuid } })

    return plainToClass(AdminDto, admin)
  }
}
