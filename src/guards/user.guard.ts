import { Admin, User } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'
import { Unauthorized, Forbidden } from 'http-errors'
import { Authenticated } from '../utils/types'

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    throw new Unauthorized('You must need a token')
  }

  const { user } = req.user as Authenticated<Admin | User>

  if (user.type !== 'user') {
    throw new Forbidden('The current user does not have the enough privileges')
  }

  next()
}
