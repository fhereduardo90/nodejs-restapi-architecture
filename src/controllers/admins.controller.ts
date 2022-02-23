import { Admin } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { CreateAdminDto } from '../dtos/admins/request/create-admin.dto'
import { UpdateAdminDto } from '../dtos/admins/request/update-admin.dto'
import { AdminService } from '../services/admin.service'
import { Authenticated } from '../utils/types'

export async function me(req: Request, res: Response): Promise<void> {
  const { user } = req.user as Authenticated<Admin>

  const result = await AdminService.findOne(user.uuid)

  res.status(200).json(result)
}

export async function updateMe(req: Request, res: Response): Promise<void> {
  const {
    user: { uuid },
  } = req.user as Authenticated<Admin>
  const dto = plainToClass(UpdateAdminDto, req.body)
  await dto.isValid()

  const result = await AdminService.update(uuid, dto)

  res.status(200).json(result)
}

export async function update(req: Request, res: Response): Promise<void> {
  const { uuid } = req.params

  const dto = plainToClass(UpdateAdminDto, req.body)
  await dto.isValid()

  const result = await AdminService.update(uuid, dto)

  res.status(200).json(result)
}

export async function create(req: Request, res: Response): Promise<void> {
  const dto = plainToClass(CreateAdminDto, req.body)
  await dto.isValid()

  const result = await AdminService.create(dto)

  res.status(201).json(result)
}

export async function find(req: Request, res: Response): Promise<void> {
  const result = await AdminService.find()

  res.status(200).json(result)
}

export async function deleteAdmin(req: Request, res: Response): Promise<void> {
  const { uuid } = req.params
  const result = await AdminService.deleteAdmin(uuid)

  res.status(204).json(result)
}

export async function findOne(req: Request, res: Response): Promise<void> {
  const result = await AdminService.findOne(req.params.uuid)

  res.status(200).json(result)
}
