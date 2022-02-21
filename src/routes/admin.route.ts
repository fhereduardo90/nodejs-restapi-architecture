import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import passport from 'passport'
import { me, update, updateUser } from '../controllers/admins.controller'
import { create, find, findOne } from '../controllers/users.controller'
import { validateAdmin, validateWriteAdmin } from '../guards/admin.guard'

const router = express.Router()
export function adminsRoutes(): Router {
  router
    .route('/me')
    .all(passport.authenticate('jwt', { session: false }), validateAdmin)
    .get(asyncHandler(me))
    .patch(asyncHandler(update))

  router
    .route('/users')
    .all(passport.authenticate('jwt', { session: false }), validateAdmin)
    .get(asyncHandler(find))
    .post(asyncHandler(create))

  router
    .route('/users/:uuid')
    .all(passport.authenticate('jwt', { session: false }), validateAdmin)
    .get(asyncHandler(findOne))
    .patch(validateWriteAdmin, asyncHandler(updateUser))

  return router
}
