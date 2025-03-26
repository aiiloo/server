import { NextFunction, Request, Response } from 'express'
import conversationsService from '~/services/conversations.services'

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
