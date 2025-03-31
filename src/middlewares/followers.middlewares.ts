import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const checkFollowersValidator = validate(
  checkSchema(
    {
      follower_user_id: {
        notEmpty: {
          errorMessage: USERS_MESSAGE.USER_ID_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseService.users.findOne({ _id: new ObjectId(value) })
            if (!user) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGE.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            const isFollower = await databaseService.followers.findOne({
              user_id: new ObjectId((req as Request).decoded_authorization._id),
              follower_user_id: new ObjectId(value)
            })
            if (isFollower) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGE.USER_IS_FOLLOWER,
                status: HTTP_STATUS.CONFLICT
              })
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyUserValidator = validate(
  checkSchema(
    {
      user_id: {
        notEmpty: {
          errorMessage: USERS_MESSAGE.USER_ID_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseService.users.findOne({ _id: new ObjectId(value) })
            if (!user) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGE.USER_NOT_FOUND,
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

export const checkIsFollowerValidator = validate(
  checkSchema(
    {
      follower_user_id: {
        notEmpty: {
          errorMessage: USERS_MESSAGE.USER_ID_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseService.users.findOne({ _id: new ObjectId(value) })
            if (!user) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGE.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            const { user_id } = (req as Request).decoded_authorization
            const isFollower = await databaseService.followers.findOne({
              user_id: new ObjectId(user_id),
              follower_user_id: new ObjectId(value)
            })
            if (!isFollower) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGE.USER_IS_NOT_FOLLOWER,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)
