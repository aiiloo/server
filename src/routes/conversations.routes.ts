import { Router } from 'express'
import {
  getConversationMediasController,
  getConversationsController,
  recallMessageController
} from '~/controllers/conversations.controllers'
import { checkConversationIdValidator, checkReceiverUserIdValidator } from '~/middlewares/conversations.middlewares'
import { accessTokenValidator, verifiedUserValidatior } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const converstationsRouter = Router()

converstationsRouter.get(
  '/receiver/:receiver_id',
  accessTokenValidator,
  verifiedUserValidatior,
  wrapRequestHandler(getConversationsController)
)

converstationsRouter.patch(
  '/status/:conversation_id',
  accessTokenValidator,
  checkConversationIdValidator,
  wrapRequestHandler(recallMessageController)
)

converstationsRouter.get(
  '/conversation-medias/:receiver_user_id',
  accessTokenValidator,
  checkReceiverUserIdValidator,
  wrapRequestHandler(getConversationMediasController)
)

export default converstationsRouter
