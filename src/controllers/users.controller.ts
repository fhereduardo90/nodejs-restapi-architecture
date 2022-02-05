import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { User } from '@prisma/client'
import { CreateUserDto } from '../dtos/users/request/create-user.dto'
import { UpdateUserDto } from '../dtos/users/request/update-user.dto'
import { UsersService } from '../services/users.service'

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
  const user = req.user as User
  const result = await UsersService.findOne(user.uuid)

  res.status(200).json(result)
}

export async function update(req: Request, res: Response): Promise<void> {
  const { uuid } = req.user as User
  const dto = plainToClass(UpdateUserDto, req.body)
  await dto.isValid()

  const result = await UsersService.update(uuid, dto)

  res.status(200).json(result)
}
