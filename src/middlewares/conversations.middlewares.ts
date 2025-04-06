import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { ConversationStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { CONVERSATIONS_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayLoad } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const checkConversationIdValidator = validate(
  checkSchema(
    {
      conversation_id: {
        notEmpty: {
          errorMessage: CONVERSATIONS_MESSAGE.CONVERSATION_ID_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const conversation = await databaseService.conversations.findOne({
              _id: new ObjectId(value)
            })
            if (!conversation) {
              throw new ErrorWithStatus({
                message: CONVERSATIONS_MESSAGE.CONVERSATION_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }

            if (conversation.status !== ConversationStatus.SENT) {
              throw new ErrorWithStatus({
                message: CONVERSATIONS_MESSAGE.CONVERSATION_NOT_SENT,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            const { user_id } = req.decoded_authorization as TokenPayLoad
            console.log('user_id: ', user_id)

            if (conversation.sender_id.toString() !== user_id) {
              throw new ErrorWithStatus({
                message: CONVERSATIONS_MESSAGE.CONVERSATION_NOT_YOUR,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            return true
          }
        }
      }
    },
    ['params']
  )
)

export const checkReceiverUserIdValidator = validate(
  checkSchema(
    {
      receiver_user_id: {
        notEmpty: {
          errorMessage: CONVERSATIONS_MESSAGE.RECEIVER_USER_ID_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const receiverUser = await databaseService.users.findOne({
              _id: new ObjectId(value)
            })

            if (!receiverUser) {
              throw new ErrorWithStatus({
                message: CONVERSATIONS_MESSAGE.RECEIVER_USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
