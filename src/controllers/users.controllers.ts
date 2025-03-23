import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { omit } from 'lodash'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/messages'
import {
  LoginRequestBody,
  LogoutReqBody,
  RegisterReqBody,
  TokenPayLoad,
  VerifyEmailReqBody
} from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersServices from '~/services/users.services'

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

export const getMeController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Get me success'
  })
}

export const updateMeController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Update me success'
  })
}

export const getProfileController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Get profile success'
  })
}

export const followController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Follow success'
  })
}

export const unfollowController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Unfollow success'
  })
}
