import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { login, logout } from '../controllers/auth.controller'

const router = express.Router()

export function authRoutes(): Router {
  router.route('/login').post(asyncHandler(login))
  router.route('/logout').post(asyncHandler(logout))

  return router
}
