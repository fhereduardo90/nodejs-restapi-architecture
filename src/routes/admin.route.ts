import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import passport from 'passport'
import {
  me,
  updateMe,
  create,
  find,
  deleteAdmin,
  update,
  findOne,
} from '../controllers/admins.controller'

import { validateAdmin, validateSuperAdmin } from '../guards/admin.guard'

const router = express.Router()
export function adminsRoutes(): Router {
  router
    .route('/me')
    .all(passport.authenticate('jwt', { session: false }), validateAdmin)
    .get(asyncHandler(me))
    .patch(asyncHandler(updateMe))

  router
    .route('')
    .all(passport.authenticate('jwt', { session: false }), validateSuperAdmin)
    .post(asyncHandler(create))
    .get(asyncHandler(find))

  router
    .route('/:uuid')
    .all(passport.authenticate('jwt', { session: false }), validateSuperAdmin)
    .get(asyncHandler(findOne))
    .delete(asyncHandler(deleteAdmin))
    .patch(asyncHandler(update))

  return router
}
