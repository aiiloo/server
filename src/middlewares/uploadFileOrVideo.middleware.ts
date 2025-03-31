import multer from 'multer'
import path from 'path'
import dotenv from 'dotenv'
import { Request } from 'express'
dotenv.config()

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, path.join(__dirname, '../assets/images'))
  },

  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
  }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['video/mp4', 'image/jpg', 'image/jpeg']

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPG, JPEG, and MP4 files are allowed!'))
  }

  if (file.mimetype === 'video/mp4' && file.size > 50 * 1024 * 1024) {
    return cb(new Error('Video file size must be less than 50MB!'))
  }

  cb(null, true)
}

export const uploads = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
})
