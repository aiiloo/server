import path from 'path'
import fs from 'fs'
import axios from 'axios'
import { FileType, getNameFromFullName, handleUpload } from '~/utils/file'
import sharp from 'sharp'
import { MediaConversationType } from '~/constants/enums'
import mime from 'mime-types'
import { Request } from 'express'
import { uploadFileToS3 } from '~/utils/s3'
import databaseService from './database.services'

class MediasService {
  async downloadAvatar(avatarUrl: string, userId: string): Promise<string> {
    try {
      const avatarDir = path.join(__dirname, '..', 'assets', 'images')
      if (!fs.existsSync(avatarDir)) {
        fs.mkdirSync(avatarDir, { recursive: true })
      }

      let fileExtension = path.extname(avatarUrl)
      if (!fileExtension) {
        fileExtension = '.jpg'
      }

      const fileName = `${userId}${fileExtension}`
      const filePath = path.join(avatarDir, fileName)

      const response = await axios({
        method: 'get',
        url: avatarUrl,
        responseType: 'stream'
      })

      const writer = fs.createWriteStream(filePath)
      response.data.pipe(writer)

      return new Promise<string>((resolve, reject) => {
        writer.on('finish', () => resolve(fileName))
        writer.on('error', reject)
      })
    } catch (error) {
      console.error('Error downloading avatar:', error)
      throw error
    }
  }

  async uploadImages({
    req,
    uploadDir,
    uploadTempDir,
    maxSize = 50 * 1024 * 1024,
    maxFiles = 3
  }: {
    req: Request
    uploadDir: string
    uploadTempDir: string
    maxSize: number
    maxFiles: number
  }) {
    const files = await handleUpload({
      req: req,
      fileType: FileType.IMAGE,
      uploadDir: uploadTempDir,
      maxSize: maxSize,
      maxFiles: maxFiles
    })
    const result: MediaConversationType[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newFullFileName = `${newName}_converted.jpg`
        const newPath = path.resolve(uploadDir, newFullFileName)
        if (file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
          await sharp(file.filepath).jpeg().toFile(newPath)
          fs.unlinkSync(file.filepath)
        } else {
          fs.renameSync(file.filepath, newPath)
        }

        const s3Result = await uploadFileToS3({
          filename: newFullFileName,
          filepath: newPath,
          folder: 'conversations/images',
          contentType: 'image/jpeg'
        })

        fs.unlinkSync(newPath)

        return {
          url: s3Result.Location as string,
          type: FileType.IMAGE
        }
      })
    )
    return result
  }

  async uploadVideo({ req, uploadDir }: { req: Request; uploadDir: string }) {
    const files = await handleUpload({
      req: req,
      fileType: FileType.VIDEO,
      uploadDir: uploadDir,
      maxSize: 50 * 1024 * 1024
    })

    const result: MediaConversationType[] = await Promise.all(
      files.map(async (file) => {
        const newPath = path.resolve(uploadDir, file.newFilename)

        fs.renameSync(file.filepath, newPath)

        const s3Result = await uploadFileToS3({
          filename: file.newFilename,
          filepath: newPath,
          folder: 'conversations/videos',
          contentType: 'video/mp4'
        })

        fs.unlinkSync(newPath)

        return {
          url: s3Result.Location as string,
          type: FileType.VIDEO
        }
      })
    )

    return result
  }

  async uploadFiles({ req, uploadDir }: { req: Request; uploadDir: string }) {
    const files = await handleUpload({
      req: req,
      fileType: FileType.DOCUMENT,
      uploadDir: uploadDir,
      maxSize: 50 * 1024 * 1024,
      maxFiles: 3
    })

    const result: MediaConversationType[] = await Promise.all(
      files.map(async (file) => {
        const newPath = path.resolve(uploadDir, file.newFilename)

        fs.renameSync(file.filepath, newPath)
        const contentType = mime.lookup(file.newFilename) || 'application/octet-stream'
        const s3Result = await uploadFileToS3({
          filename: file.newFilename,
          filepath: newPath,
          folder: 'conversations/files',
          contentType: contentType
        })

        fs.unlinkSync(newPath)

        return {
          url: s3Result.Location as string,
          type: FileType.DOCUMENT,
          name: file.originalFilename as string
        }
      })
    )

    return result
  }

  async uploadAudio({ req, uploadDir }: { req: Request; uploadDir: string }) {
    const files = await handleUpload({
      req: req,
      fileType: FileType.AUDIO,
      uploadDir: uploadDir,
      maxSize: 100 * 1024 * 1024,
      maxFiles: 3
    })
    console.log('Files: ', files)

    const result: MediaConversationType[] = await Promise.all(
      files.map(async (file) => {
        const newPath = path.resolve(uploadDir, file.newFilename)
        console.log('Super name: ', file.newFilename)
        fs.renameSync(file.filepath, newPath)
        const contentType = mime.lookup(file.newFilename) || 'application/octet-stream'
        const s3Result = await uploadFileToS3({
          filename: file.newFilename,
          filepath: newPath,
          folder: 'conversations/audios',
          contentType: contentType
        })

        fs.unlinkSync(newPath)

        return {
          url: s3Result.Location as string,
          type: FileType.AUDIO,
          name: file.originalFilename as string
        }
      })
    )

    return result
  }
}

const mediasServices = new MediasService()
export default mediasServices
