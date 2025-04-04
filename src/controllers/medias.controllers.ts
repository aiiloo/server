import { Request, Response } from 'express'
import {
  UPLOAD_CONVERSATION_AUDIO_DIR,
  UPLOAD_CONVERSATION_FILE_DIR,
  UPLOAD_CONVERSATION_IMAGE_DIR,
  UPLOAD_CONVERSATION_IMAGE_TEMP_DIR,
  UPLOAD_IMAGE_TEMP_DIR,
  UPLOAD_VIDEO_DIR
} from '~/constants/dir'
import mediasServices from '~/services/medias.services'
import { deleteFileFromS3ByUrl } from '~/utils/s3'

export const uploadImageController = async (req: Request, res: Response) => {
  const url = await mediasServices.uploadImages({
    req: req,
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    uploadTempDir: UPLOAD_IMAGE_TEMP_DIR,
    maxSize: 100 * 1024 * 1024,
    maxFiles: 3
  })
  return res.status(201).json({
    message: 'Upload image successfully',
    result: url
  })
}

export const uploadConversationImageControllers = async (req: Request, res: Response) => {
  const url = await mediasServices.uploadImages({
    req: req,
    uploadDir: UPLOAD_CONVERSATION_IMAGE_DIR,
    uploadTempDir: UPLOAD_CONVERSATION_IMAGE_TEMP_DIR,
    maxFiles: 2,
    maxSize: 100 * 1024 * 1024
  })
  return res.status(201).json({
    message: 'Upload image successfully',
    data: url
  })
}

export const uploadConversationVideoController = async (req: Request, res: Response) => {
  const url = await mediasServices.uploadVideo({
    req: req,
    uploadDir: UPLOAD_VIDEO_DIR
  })
  return res.status(201).json({
    message: 'Upload image successfully',
    data: url
  })
}

export const uploadConversationFilesControllers = async (req: Request, res: Response) => {
  const url = await mediasServices.uploadFiles({
    req: req,
    uploadDir: UPLOAD_CONVERSATION_FILE_DIR
  })
  return res.status(201).json({
    message: 'Upload image successfully',
    data: url
  })
}

export const uploadConversationAudioControllers = async (req: Request, res: Response) => {
  const url = await mediasServices.uploadAudio({
    req: req,
    uploadDir: UPLOAD_CONVERSATION_AUDIO_DIR
  })
  return res.status(201).json({
    message: 'Upload image successfully',
    data: url
  })
}

export const removeFileController = async (req: Request, res: Response) => {
  const { filePath } = req.body
  if (!filePath) {
    return res.status(400).json({
      message: 'File name is required'
    })
  }
  const result = deleteFileFromS3ByUrl(filePath)

  result
    .then(() => {
      return res.status(200).json({
        message: 'Remove file successfully'
      })
    })
    .catch((error) => {
      return res.status(500).json({
        message: error
      })
    })
}
