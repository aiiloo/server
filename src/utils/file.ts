import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import {
  UPLOAD_CONVERSATION_FILE_DIR,
  UPLOAD_CONVERSATION_IMAGE_DIR,
  UPLOAD_CONVERSATION_IMAGE_TEMP_DIR,
  UPLOAD_IMAGE_DIR,
  UPLOAD_IMAGE_TEMP_DIR,
  UPLOAD_VIDEO_DIR
} from '~/constants/dir'
import { ErrorWithStatus } from '~/models/Errors'
import { deleteFileFromS3ByUrl } from './s3'

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document'
}

const MIME_TYPES: Record<FileType, string[]> = {
  [FileType.IMAGE]: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  [FileType.VIDEO]: ['video/mp4', 'video/webm', 'video/ogg'],
  [FileType.AUDIO]: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  [FileType.DOCUMENT]: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ]
}
export const initFolder = () => {
  ;[
    UPLOAD_IMAGE_TEMP_DIR,
    UPLOAD_IMAGE_DIR,
    UPLOAD_VIDEO_DIR,
    UPLOAD_CONVERSATION_FILE_DIR,
    UPLOAD_CONVERSATION_IMAGE_DIR,
    UPLOAD_CONVERSATION_IMAGE_TEMP_DIR
  ].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

export const handleUpload = async ({
  req,
  fileType,
  uploadDir,
  maxSize = 300 * 1024,
  maxFiles = 1
}: {
  req: Request
  fileType: FileType
  uploadDir: string
  maxSize?: number
  maxFiles?: number
}): Promise<File[]> => {
  const form = formidable({
    uploadDir,
    maxFiles,
    keepExtensions: true,
    maxFileSize: maxSize,
    filter: ({ name, originalFilename, mimetype }) => {
      // Kiểm tra file có hợp lệ không
      const isValid = name === fileType && mimetype ? MIME_TYPES[fileType].includes(mimetype) : false

      if (!isValid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return isValid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)

      const uploadedFiles = files[fileType] as File[] | undefined
      if (!uploadedFiles || uploadedFiles.length === 0) {
        return reject(new Error('File is empty'))
      }

      resolve(uploadedFiles)
    })
  })
}

export const getNameFromFullName = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}

