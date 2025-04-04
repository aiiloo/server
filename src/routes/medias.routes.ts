import { Request, Response, Router } from 'express'
import {
  removeFileController,
  uploadConversationAudioControllers,
  uploadConversationFilesControllers,
  uploadConversationImageControllers,
  uploadConversationVideoController,
  uploadImageController
} from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouter = Router()

mediasRouter.post('/upload-image', wrapRequestHandler(uploadImageController))

mediasRouter.post('/upload-conversation-image', wrapRequestHandler(uploadConversationImageControllers))
mediasRouter.post('/upload-conversation-video', wrapRequestHandler(uploadConversationVideoController))
mediasRouter.post('/upload-conversation-file', wrapRequestHandler(uploadConversationFilesControllers))
mediasRouter.post('/upload-conversation-audio', wrapRequestHandler(uploadConversationAudioControllers))
mediasRouter.delete('/remove-file', wrapRequestHandler(removeFileController))

export default mediasRouter
