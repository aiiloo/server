import { ObjectId, UpdateFilter } from 'mongodb'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { signToken } from '~/utils/jwt'
import type { StringValue } from 'ms'
import databaseService from './database.services'
import User from '~/models/schemas/User.schema'
import { hashPassword } from '~/utils/crypto'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import path from 'path'
import fs from 'fs'
import { UpdateUserProfile } from '~/types/users.types'
import sharp from 'sharp'
import { sendEmail } from '~/emails/smtp'
import axios from 'axios'
import { ErrorWithStatus } from '~/models/Errors'
import { USERS_MESSAGE } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { omit } from 'lodash'


class UsersService {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  private signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIRY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  private async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }

    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return data as {
      id_token: string
      access_token: string
    }
  }

  private async getGoogleUserInfo(access_token: string, id_token: string) {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })

    return data as {
      id: string
      email: string
      verified_email: boolean
      name: string
      given_name: string
      family_name: string
      picture: string
    }
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id) })
    )

    await sendEmail({
      to: payload.email,
      subject: 'Verify Your Email',
      templateName: 'verifyEmail',
      replacements: {
        USERNAME: payload.name,
        VERIFY_LINK: `http://localhost:3000/email-verify?token=${email_verify_token}`
      }
    })
    return {
      access_token,
      refresh_token
    }
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    console.log(user)
    return Boolean(user)
  }

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify
    })
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id) })
    )
    return {
      access_token,
      refresh_token
    }
  }


  async getMyProfile(user_id: ObjectId | undefined): Promise<User | null> {
    const user = await databaseService.users.findOne({ user_id })
    if (user) return user
    else return null
  }

  async updateMyProfile(user_id: ObjectId, data: UpdateUserProfile): Promise<{ message: string }> {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

    if (!user) return { message: 'user not found' }

    if (data.files?.avatar) {
      if (user.avatar) this.deleteFile(user.avatar)
      const ext = path.extname(data.files?.avatar.filename).toLowerCase()
      if (ext === '.jpg') {
        const filePath = data.files?.avatar.path
        const fileName = path.basename(filePath)
        const newFilePath = path.join(__dirname, '../assets/images/', fileName)

        await fs.promises.rename(data.files?.avatar.path, newFilePath)
      } else if (ext === '.png' || ext === '.jpeg') {
        data.files.avatar.filename = await this.uploadImage(data.files?.avatar)
      } else {
        await fs.promises.unlink(data.files?.avatar.path)
        return { message: 'Error processing image' }
      }
    }

    if (data.files?.cover_photo) {
      if (user.avatar) this.deleteFile(user.avatar)
      const ext = path.extname(data.files?.cover_photo.filename).toLowerCase()
      if (ext === '.jpg') {
        const filePath = data.files?.cover_photo.path
        const fileName = path.basename(filePath)
        const newFilePath = path.join(__dirname, '../assets/images/', fileName)

        await fs.promises.rename(data.files?.cover_photo.path, newFilePath)
      } else if (ext === '.png' || ext === '.jpeg') {
        data.files.cover_photo.filename = await this.uploadImage(data.files?.cover_photo)
      } else {
        await fs.promises.unlink(data.files?.cover_photo.path)
        return { message: 'Error processing image' }
      }
    }

    const updateUser: UpdateFilter<User> = {
      $set: {
        name: data.name,
        date_of_birth: data.date_of_birth,
        bio: data.bio,
        location: data.location,
        website: data.website,
        username: data.username,
        avatar: data.files?.avatar?.filename,
        cover_photo: data.files?.cover_photo?.filename
      }
    }

    const result = await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, updateUser)

    if (result.modifiedCount > 0) {
      return {
        message: 'Update successfully'
      }
    } else {
      return {
        message: 'Update failure'
      }
    }
  }

  async deleteFile(imageUrl: string): Promise<{ message: string }> {
    const fileName = path.basename(imageUrl)
    try {
      await fs.promises.unlink(path.join(__dirname, '../assets/images/', fileName))
      return { message: 'delete file success' }
    } catch (error: any) {
      return { message: error.message }
    }
  }

  getNameFromFullName = (fullname: string) => {
    const nameArr = fullname.split('.')
    nameArr.pop()
    return nameArr.join('')
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const newName = this.getNameFromFullName(file.filename)

    const newPath = path.resolve('../server/src/assets/images/', `${newName}.jpg`)
    const filePath = file.path
    await sharp(filePath).jpeg().toFile(newPath)

    await fs.unlinkSync(filePath)

    return `${newName}.jpg`
  }
  
  async oauth(code: string) {
    const { id_token, access_token } = await this.getOauthGoogleToken(code)
    const userInfo = await this.getGoogleUserInfo(access_token, id_token)
    // console.log('UserInfo: ', userInfo)
    if (!userInfo.verified_email) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGE.GMAIL_NOT_VERIFIED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    const user = await databaseService.users.findOne({ email: userInfo.email })
    if (user) {
      const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
        user_id: user._id.toString(),
        verify: user.verify
      })

      await databaseService.refreshTokens.insertOne(
        new RefreshToken({ token: refresh_token, user_id: new ObjectId(user._id) })
      )

      return {
        access_token,
        refresh_token,
        newUser: 0,
        verify: user.verify,
        userData: omit(user, ['password', 'email_verify_token', 'forgot_password_token'])
      }
    } else {
      const password = Math.random().toString(36).substring(2, 15)
      const data = await this.register({
        email: userInfo.email,
        name: userInfo.name,
        date_of_birth: new Date().toISOString(),
        password,
        comfirm_password: password
      })

      const user = await databaseService.users.findOneAndUpdate(
        { email: userInfo.email },
        { $set: { avatar: userInfo.picture } },
        { returnDocument: 'after' }
      )

      return {
        ...data,
        newUser: 1,
        verify: UserVerifyStatus.Unverified,
        userData: omit(user, ['password', 'email_verify_token', 'forgot_password_token'])
      }
    }
  }

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken({
        user_id,
        verify: UserVerifyStatus.Verified
      }),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified
            //  updated_at: new Date()
          },
          $currentDate: { updated_at: true }
        }
      )
    ])
    const [access_token, refresh_token] = token
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id) })
    )
    return {
      access_token,
      refresh_token
    }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: USERS_MESSAGE.LOGOUT_SUCCESSFULLY
    }
  }
}

const usersServices = new UsersService()

export default usersServices
