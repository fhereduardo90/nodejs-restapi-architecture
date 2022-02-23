import { Admin } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { Authenticated } from '../utils/types'

export const validateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  AuthService.validateAdmin(req.user as Authenticated<Admin>)

  next()
}

export const validateWriteAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  AuthService.validateWriteAdmin(req.user as Authenticated<Admin>)

  next()
}

export const validateSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  AuthService.validateSuperAdmin(req.user as Authenticated<Admin>)

  next()
}

export const validateReadAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  AuthService.validateReadAdmin(req.user as Authenticated<Admin>)

  next()
}
