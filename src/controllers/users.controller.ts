import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { CreateUserDto } from '../dtos/users/request/create-user.dto'
import { UpdateUserDto } from '../dtos/users/request/update-user.dto'
import { UserDto } from '../dtos/users/response/user.dto'
import { UsersService } from '../services/users.service'

export async function find(req: Request, res: Response): Promise<void> {
  const users = await UsersService.find()

  res.status(200).json(plainToClass(UserDto, users))
}

export async function create(req: Request, res: Response): Promise<void> {
  const dto = plainToClass(CreateUserDto, req.body)
  await dto.isValid()

  const user = await UsersService.create(dto)

  res.status(201).json(plainToClass(UserDto, user))
}

export async function findOne(req: Request, res: Response): Promise<void> {
  const user = await UsersService.findOne(req.params.uuid)

  res.status(200).json(plainToClass(UserDto, user))
}

export async function update(req: Request, res: Response): Promise<void> {
  const dto = plainToClass(UpdateUserDto, req.body)
  await dto.isValid()

  const user = await UsersService.update(req.params.uuid, dto)

  res.status(200).json(plainToClass(UserDto, user))
}
