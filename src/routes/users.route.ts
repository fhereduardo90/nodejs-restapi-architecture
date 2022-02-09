import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import passport from 'passport'
import {
  find,
  create,
  findOne,
  update,
  me,
  confirmAccount,
} from '../controllers/users.controller'

const router = express.Router()

export function usersRoutes(): Router {
  router.route('/').get(asyncHandler(find)).post(asyncHandler(create))
  router
    .route('/me')
    .get(passport.authenticate('jwt', { session: false }), asyncHandler(me))
    .patch(
      passport.authenticate('jwt', { session: false }),
      asyncHandler(update),
    )
  router.route('/:uuid').get(asyncHandler(findOne))
  router.route('/confirm-account').post(asyncHandler(confirmAccount))

  return router
}
