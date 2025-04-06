import { NextFunction, Request, Response } from 'express'
import { CONVERSATIONS_MESSAGE } from '~/constants/messages'
import { TokenPayLoad } from '~/models/requests/User.requests'
import conversationsService from '~/services/conversations.services'
import { FileType } from '~/utils/file'

export const getConversationsController = async (req: Request, res: Response, next: NextFunction) => {
  const { receiver_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const sender_id = req.decoded_authorization?.user_id as string

  const result = await conversationsService.getConverstations({
    sender_id,
    receiver_id,
    limit: limit,
    page: page
  })
  return res.json({
    message: 'Get conversations success',
    data: {
      limit,
      page,
      total_pages: Math.ceil(result.total / limit),
      conversations: result.conversations
    }
  })
}

export const recallMessageController = async (req: Request, res: Response, next: NextFunction) => {
  const { conversation_id } = req.params
  const result = await conversationsService.recallMessage(conversation_id)
  return res.json({
    message: CONVERSATIONS_MESSAGE.UNSEND_MESSAGE_SUCCESSFULLY,
    data: result
  })
}

export const getConversationMediasController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const receiver_user_id = req.params.receiver_user_id
  const type = req.query.type as FileType // IMAGE, VIDEO, DOCUMENT
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  if (!Object.values(FileType).includes(type)) {
    return res.status(400).json({ message: 'Invalid media type' })
  }

  const result = await conversationsService.getConversationMedias({
    user_id,
    receiver_user_id,
    type,
    limit,
    page
  })

  let message = ''
  switch (type) {
    case FileType.IMAGE:
      message = CONVERSATIONS_MESSAGE.GET_CONVERSATION_IMAGE_SUCCESSFULLY
      break
    case FileType.VIDEO:
      message = CONVERSATIONS_MESSAGE.GET_CONVERSATION_VIDEO_SUCCESSFULLY
      break
    case FileType.DOCUMENT:
      message = CONVERSATIONS_MESSAGE.GET_CONVERSATION_FILE_SUCCESSFULLY
      break
    case FileType.AUDIO:
      message = CONVERSATIONS_MESSAGE.GET_CONVERSATION_AUDIO_SUCCESSFULLY
      break
  }

  return res.json({
    message,
    data: result
  })
}
