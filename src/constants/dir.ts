import path from 'path'

const ROOT_DIR = process.cwd()

export const UPLOAD_IMAGE_TEMP_DIR = path.join(ROOT_DIR, 'src/assets/imagesTemp')
export const UPLOAD_IMAGE_DIR = path.join(ROOT_DIR, 'src/assets/images')

export const UPLOAD_VIDEO_DIR = path.join(ROOT_DIR, 'src/assets/conversationVideos')

export const UPLOAD_CONVERSATION_IMAGE_TEMP_DIR = path.join(ROOT_DIR, 'src/assets/conversationImagesTemp')
export const UPLOAD_CONVERSATION_IMAGE_DIR = path.join(ROOT_DIR, 'src/assets/conversationImages')

export const UPLOAD_CONVERSATION_FILE_DIR = path.join(ROOT_DIR, 'src/assets/conversationFiles')

export const UPLOAD_CONVERSATION_AUDIO_DIR = path.join(ROOT_DIR, 'src/assets/conversationAudios')
