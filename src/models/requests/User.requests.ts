import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enums'

export interface GetProfileReqParams {
  username: string
}

export interface UnfollowReqParams {
  user_id: string
}

export interface FollowReqBody {
  follow_user_id: string
}

export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface LoginRequestBody {
  email: string
  password: string
}

export interface VerifyEmailReqBody {
  email_verify_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}

export interface ResetPasswordReqBody {
  password: string
  comfirm_password: string
  forgot_password_token: string
}
export interface ChangePasswordReqBody {
  old_password: string
  password: string
  comfirm_password: string
}

export interface RegisterReqBody {
  email: string
  password: string
  name: string
  comfirm_password: string
  date_of_birth: string
  verify?: UserVerifyStatus
}

export interface TokenPayLoad extends JwtPayload {
  user_id: string
  token_type: TokenType
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}
