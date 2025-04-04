import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

config()

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})

export const uploadFileToS3 = ({
  folder, // Thêm tham số folder để chỉ định thư mục
  filename,
  filepath,
  contentType
}: {
  folder?: string
  filename: string
  filepath: string
  contentType: string
}) => {
  const fileKey = folder ? `${folder}/${filename}` : filename

  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: 'aiiloo-ap-southeast-1',
      Key: fileKey,
      Body: fs.readFileSync(filepath),
      ContentType: contentType
    },
    queueSize: 4,
    partSize: 1024 * 1024 * 5,
    leavePartsOnError: false
  })

  return parallelUploads3.done()
}

export const deleteFileFromS3ByUrl = async (fileUrl: string) => {
  try {
    const bucketName = 'aiiloo-ap-southeast-1'

    const url = new URL(fileUrl)
    const fileKey = url.pathname.substring(1)

    const result = await s3.deleteObject({
      Bucket: bucketName,
      Key: fileKey
    })
    return result
  } catch (error) {
    console.error(`❌ Lỗi khi xóa file từ URL: ${fileUrl}`, error)
  }
}
