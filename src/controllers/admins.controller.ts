import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { UpdateAdminDto } from '../dtos/admins/request/update-user.dto'
import { UpdateUserDto } from '../dtos/users/request/update-user.dto'
import { AdminService } from '../services/admin.service'
import { UsersService } from '../services/users.service'
import { Authenticated } from '../utils/types'

export async function me(req: Request, res: Response): Promise<void> {
  const { user } = req.user as Authenticated

  const result = await AdminService.findOne(user.uuid)

  res.status(200).json(result)
}

export async function update(req: Request, res: Response): Promise<void> {
  const {
    user: { uuid },
  } = req.user as Authenticated
  const dto = plainToClass(UpdateAdminDto, req.body)
  await dto.isValid()

  const result = await AdminService.update(uuid, dto)

  res.status(200).json(result)
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const { uuid } = req.params
  const dto = plainToClass(UpdateUserDto, req.body)
  await dto.isValid()

  const result = await UsersService.update(uuid, dto)

  res.status(200).json(result)
}
