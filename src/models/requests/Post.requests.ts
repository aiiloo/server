import { ObjectId } from 'mongodb'
import { Media, PostAudience, PostType } from '~/constants/enums'

export interface NewPost {
  type: PostType.NewPost
  audience: PostAudience
  content: string
  parent_id: null
  medias: Media[]
  user_views: number
  created_at?: Date
  updated_at?: Date
}

export interface ReqPost {
  type: PostType
  audience: PostAudience
  content: string
  parent_id: ObjectId
  user_views: number
  created_at?: Date
  updated_at?: Date
  files?: CustomFile
}

export interface CustomFile extends Express.Multer.File {
  medias: Media[]
}
