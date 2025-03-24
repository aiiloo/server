import { Router } from 'express'
import { loginController,
  logoutController,
  oauthController,
  registerController,
  verifyEmailController,
  getMyProfileController,
  updateMyProfileController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { upload } from '~/middlewares/uploadFile.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.get('/', (req, res) => {
  res.send('Hello World!')
})

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
usersRouter.get('/myProfile', accessTokenValidator, wrapRequestHandler(getMyProfileController))
usersRouter.post(
  '/profile/update',
  accessTokenValidator,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover_photo', maxCount: 1 }
  ]),
  wrapRequestHandler(updateMyProfileController)
)


export default usersRouter
