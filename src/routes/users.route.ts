import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import passport from 'passport'
import { update, me, confirmAccount } from '../controllers/users.controller'

const router = express.Router()

export function usersRoutes(): Router {
  router
    .route('/me')
    .get(passport.authenticate('jwt', { session: false }), asyncHandler(me))
    .patch(
      passport.authenticate('jwt', { session: false }),
      asyncHandler(update),
    )

  router.route('/confirm-account').post(asyncHandler(confirmAccount))

  return router
}
