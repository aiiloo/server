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
    cb(null, path.join(__dirname, '../assets/imagesTem'))
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
  }
})

export const upload = multer({ storage: storage })
