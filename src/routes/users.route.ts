import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { find, create, findOne, update } from '../controllers/users.controller'

const router = express.Router()

export function usersRoutes(): Router {
  router.route('/').get(asyncHandler(find)).post(asyncHandler(create))
  router.route('/:uuid').get(asyncHandler(findOne)).patch(asyncHandler(update))

  return router
}
