import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import passport from 'passport'
import {
  update,
  me,
  confirmAccount,
  updateMe,
} from '../controllers/users.controller'

import {
  create as createUser,
  deleteUser,
  find as findUsers,
  findOne,
} from '../controllers/users.controller'
import {
  validateAdmin,
  validateReadAdmin,
  validateWriteAdmin,
} from '../guards/admin.guard'
const router = express.Router()

export function usersRoutes(): Router {
  router
    .route('/me')
    .get(passport.authenticate('jwt', { session: false }), asyncHandler(me))
    .patch(
      passport.authenticate('jwt', { session: false }),
      asyncHandler(updateMe),
    )

  router.route('/confirm-account').post(asyncHandler(confirmAccount))

  router
    .route('/')
    .all(passport.authenticate('jwt', { session: false }), validateAdmin)
    .get(validateReadAdmin, asyncHandler(findUsers))
    .post(validateWriteAdmin, asyncHandler(createUser))

  router
    .route('/:uuid')
    .all(passport.authenticate('jwt', { session: false }), validateAdmin)
    .get(validateReadAdmin, asyncHandler(findOne))
    .patch(validateWriteAdmin, asyncHandler(update))
    .delete(validateWriteAdmin, asyncHandler(deleteUser))

  return router
}
