import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { omit } from 'lodash'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/messages'
import {
  LoginRequestBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  TokenPayLoad,
  VerifyEmailReqBody
} from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersServices from '~/services/users.services'
import { UpdateUserProfile } from '~/types/users.types'

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersServices.login({ user_id: user_id.toString(), verify: user.verify })
  const userData = omit(user, ['password', 'email_verify_token', 'forgot_password_token'])
  return res.json({
    message: USERS_MESSAGE.LOGIN_SUCCESSFULLY,
    data: {
      ...result,
      user: userData
    }
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  await usersServices.register(req.body)
  return res.status(201).json({
    message: USERS_MESSAGE.REGISTER_SUCCESSFULLY,
    data: {}
  })
}

export const oauthController = async (req: Request, res: Response) => {
  const { code } = req.query
  console.log(req.query)
  const result = await usersServices.oauth(code as string)
  console.log('result: ', result)
  const userDataEncoded = encodeURIComponent(JSON.stringify(result.userData))
  const urlRedirect = `${process.env.CLIENT_REDIRECT_CALLBACK}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&new_user=${result.newUser}&user_data=${userDataEncoded}`
  return res.redirect(urlRedirect)
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await usersServices.logout(refresh_token)

  return res.status(200).json({
    message: USERS_MESSAGE.LOGOUT_SUCCESSFULLY
  })
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
) => {
  const { refresh_token } = req.body
  const { user_id, exp } = req.decoded_refresh_token as TokenPayLoad
  const result = await usersServices.refreshToken(refresh_token, user_id, exp as number)
  return res.json({
    message: USERS_MESSAGE.REFRESH_TOKEN_SUCCESSFULLY,
    data: result
  })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayLoad
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGE.USER_NOT_FOUND
    })
  }
  if (user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGE.EMAIL_ALREADY_VERIFIED
    })
  }

  const result = await usersServices.verifyEmail(user_id)
  const userData = omit(user, ['password', 'email_verify_token', 'forgot_password_token'])
  return res.json({
    message: USERS_MESSAGE.EMAIL_VERIFY_SUCCESSFULLY,
    data: {
      ...result,
      user: userData
    }
  })
}

export const resendVerifyEmailController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Resend verify email success'
  })
}

export const forgotPasswordController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Forgot password success'
  })
}

export const verifyForgotPasswordTokenController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Verify forgot password token success'
  })
}

export const resetPasswordController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Reset password success'
  })
}

export const changePasswordController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Change password success'
  })
}

export const searchController = async (req: Request, res: Response) => {
  const { search_key } = req.body
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)

  const result = await usersServices.search({
    searchKey: search_key,
    limit: limit,
    page: page
  })
  return res.json({
    message: USERS_MESSAGE.SEARCH_SUCCESSFULLY,
    data: result
  })
}

export const getMyProfileController = async (req: Request, res: Response) => {
  const user_id = req.decoded_authorization.user_id
  const result = await usersServices.getMyProfile(user_id)
  if (result)
    return res.status(201).json({
      message: USERS_MESSAGE.GET_MY_PROFILE_SUCCESSFULLY,
      data: result
    })
  else
    return res.status(404).json({
      message: USERS_MESSAGE.GET_MY_PROFILE_FAILURE,
      data: result
    })
}

export const updateMyProfileController = async (
  req: Request<ParamsDictionary, any, UpdateUserProfile>,
  res: Response
) => {
  const user_id = req.decoded_authorization.user_id
  const data: UpdateUserProfile = req.body

  if (req.files) {
    const files = req.files as Record<string, Express.Multer.File[]>

    if (files.avatar) {
      data.files = data.files || {}
      data.files.avatar = files.avatar[0]
    }
    if (files.cover_photo) {
      data.files = data.files || {}
      data.files.cover_photo = files.cover_photo[0]
    }
  }

  const result = await usersServices.updateMyProfile(user_id, data)

  return res.status(200).json({
    message: 'update user success',
    data: result
  })
}

export const getProfileByUsernameController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization
  const { username } = req.params
  const result = await usersServices.getProfileByUsername(username, user_id)
  if (result)
    return res.status(200).json({
      message: USERS_MESSAGE.GET_PROFILE_BY_USERNAME_SUCCESSFULLY,
      data: result
    })
  else
    return res.status(404).json({
      message: USERS_MESSAGE.GET_PROFILE_BY_USERNAME_FAILURE,
      data: result
    })
}
