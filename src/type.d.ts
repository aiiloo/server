import { Request } from 'express'
import User from './models/schemas/User.schema'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayLoad
    decoded_email_verify_token?: TokenPayLoad
    decoded_refresh_token?: TokenPayLoad
  }
}
