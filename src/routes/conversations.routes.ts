import { Router } from 'express'
import { getConversationsController } from '~/controllers/conversations.controllers'
import { accessTokenValidator, verifiedUserValidatior } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const converstationsRouter = Router()

converstationsRouter.get(
  '/receiver/:receiver_id',
  accessTokenValidator,
  verifiedUserValidatior,
  wrapRequestHandler(getConversationsController)
)

export default converstationsRouter
