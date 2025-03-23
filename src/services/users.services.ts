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
  constructor() {}

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

    console.log('email_verify_token', email_verify_token)
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

    console.log('check newName', newName)

    await fs.unlinkSync(filePath)

    return `${newName}.jpg`
  }
}

const usersServices = new UsersService()

export default usersServices
