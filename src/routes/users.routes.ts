import { Router } from 'express'
import {
  getMyProfileController,
  loginController,
  registerController,
  updateMyProfileController
} from '~/controllers/users.controllers'
import { loginValidator, registerValidator, accessTokenValidator } from '~/middlewares/users.middlewares'
import { upload } from '~/middlewares/uploadFile.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.get('/', (req, res) => {
  res.send('Hello World!')
})

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
usersRouter.post(
  '/register',

  registerValidator,
  wrapRequestHandler(registerController)
)
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
