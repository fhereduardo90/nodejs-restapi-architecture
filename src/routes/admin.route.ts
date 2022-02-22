import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import passport from 'passport'
import {
  me,
  update,
  updateUser,
  create,
  find,
  deleteAdmin,
  updateAdmin,
} from '../controllers/admins.controller'
import {
  create as createUser,
  deleteUser,
  find as findUsers,
  findOne,
} from '../controllers/users.controller'
import {
  validateAdmin,
  validateSuperAdmin,
  validateWriteAdmin,
} from '../guards/admin.guard'

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
    .get(asyncHandler(findUsers))
    .post(asyncHandler(createUser))

  router
    .route('/users/:uuid')
    .all(passport.authenticate('jwt', { session: false }), validateAdmin)
    .get(asyncHandler(findOne))
    .patch(validateWriteAdmin, asyncHandler(updateUser))
    .delete(validateWriteAdmin, asyncHandler(deleteUser))

  router
    .route('')
    .all(passport.authenticate('jwt', { session: false }), validateSuperAdmin)
    .post(asyncHandler(create))
    .get(asyncHandler(find))

  router
    .route('/:uuid')
    .all(passport.authenticate('jwt', { session: false }), validateSuperAdmin)
    .delete(asyncHandler(deleteAdmin))
    .patch(asyncHandler(updateAdmin))
  return router
}
