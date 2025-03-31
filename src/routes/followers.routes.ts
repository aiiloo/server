import { Router } from 'express'
import {
  addFollowerController,
  getFollowersController,
  getMutualFollowersController,
  removeFollowerController
} from '~/controllers/followers.controllers'
import {
  checkFollowersValidator,
  checkIsFollowerValidator,
  verifyUserValidator
} from '~/middlewares/followers.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const followersRouter = Router()

followersRouter.post(
  '/add-follower',
  accessTokenValidator,
  checkFollowersValidator,
  wrapRequestHandler(addFollowerController)
)
followersRouter.get('/get-followers/:user_id', verifyUserValidator, wrapRequestHandler(getFollowersController))
followersRouter.get('/mutual-followers', accessTokenValidator, wrapRequestHandler(getMutualFollowersController))

followersRouter.delete(
  '/remove-follower',
  accessTokenValidator,
  checkIsFollowerValidator,
  wrapRequestHandler(removeFollowerController)
)

export default followersRouter
