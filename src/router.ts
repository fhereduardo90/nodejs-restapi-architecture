import express, { Router } from 'express'
import { usersRoutes } from './routes/users.route'

const expressRouter = express.Router()

export function router(app: Router): Router {
  app.use('/api/v1/users', usersRoutes())

  return expressRouter
}
