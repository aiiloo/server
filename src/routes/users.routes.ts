import { Router } from 'express'
import {
  loginController,
  oauthController,
  registerController,
  verifyEmailController
} from '~/controllers/users.controllers'
import { emailVerifyTokenValidator, loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.get('/', (req, res) => {
  res.send('Hello World!')
})

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

export default usersRouter
