import { UserType } from '~/models/schemas/User.schema'
import { Multer } from 'multer'

export type UpdateUserProfile = Omit<
  UserType,
  '_id' | 'email' | 'password' | 'created_at' | 'updated_at' | 'email_verify_token' | 'forgot_password_token' | 'verify'
> & {
  files?: {
    avatar?: Express.Multer.File
    cover_photo?: Express.Multer.File
  }
}
