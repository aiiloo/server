import path from 'path'
import fs from 'fs'
import axios from 'axios'

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
}

const mediasServices = new MediasService()
export default mediasServices
