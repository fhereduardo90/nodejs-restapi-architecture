import { Admin, AdminRole } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'
import { Unauthorized, Forbidden } from 'http-errors'
import { Authenticated } from '../utils/types'

export const validateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    throw new Unauthorized('You must need a token')
  }

  const { user } = req.user as Authenticated

  if (user.type !== 'admin') {
    throw new Forbidden('The current user does not have the enough privileges')
  }

  next()
}

export const validateWriteAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { user } = req.user as Authenticated

  if (user.role === AdminRole.READ) {
    throw new Forbidden('The current admin does not have the enough privileges')
  }

  next()
}
