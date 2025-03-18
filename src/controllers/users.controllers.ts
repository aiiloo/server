import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGE } from '~/constants/messages'
import { RegisterReqBody } from '~/models/requests/User.requests'
import usersServices from '~/services/users.services'

export const loginController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Login success'
  })
}
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersServices.register(req.body)
  return res.status(201).json({
    message: USERS_MESSAGE.REGISTER_SUCCESSFULLY,
    result
  })
}

export const oauthController = async (req: Request, res: Response) => {
  return res.json({
    message: 'OAuth success'
  })
}

export const logoutController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Logout success'
  })
}

export const VerifyEmailController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Verify email success'
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
