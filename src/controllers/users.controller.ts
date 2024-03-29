import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { User } from '@prisma/client'
import { CreateUserDto } from '../dtos/users/request/create-user.dto'
import { UpdateUserDto } from '../dtos/users/request/update-user.dto'
import { UsersService } from '../services/users.service'
import { Authenticated } from '../utils/types'

export async function find(req: Request, res: Response): Promise<void> {
  const result = await UsersService.find()

  res.status(200).json(result)
}

export async function create(req: Request, res: Response): Promise<void> {
  const dto = plainToClass(CreateUserDto, req.body)
  await dto.isValid()

  const result = await UsersService.create(dto)

  res.status(201).json(result)
}

export async function findOne(req: Request, res: Response): Promise<void> {
  const result = await UsersService.findOne(req.params.uuid)

  res.status(200).json(result)
}

export async function me(req: Request, res: Response): Promise<void> {
  const { user } = req.user as Authenticated<User>

  const result = await UsersService.findOne(user.uuid)

  res.status(200).json(result)
}

export async function updateMe(req: Request, res: Response): Promise<void> {
  const {
    user: { uuid },
  } = req.user as Authenticated<User>
  const dto = plainToClass(UpdateUserDto, req.body)
  await dto.isValid()

  const result = await UsersService.update(uuid, dto)

  res.status(200).json(result)
}

export async function confirmAccount(
  req: Request,
  res: Response,
): Promise<void> {
  await UsersService.confirmAccount(req.query.token as string)

  res.status(204).send()
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const { uuid } = req.params
  const result = await UsersService.delete(uuid)

  res.status(204).json(result)
}

export async function update(req: Request, res: Response): Promise<void> {
  const { uuid } = req.params
  const dto = plainToClass(UpdateUserDto, req.body)
  await dto.isValid()

  const result = await UsersService.update(uuid, dto)

  res.status(200).json(result)
}
