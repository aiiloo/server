import { ObjectId } from 'mongodb'
import { MediaType, PostAudience, PostType } from '~/constants/enums'

export interface Media {
  url: string
  type: MediaType // video, image
}

export interface PostAType {
  _id?: ObjectId
  user_id: ObjectId
  type: PostType
  audience: PostAudience
  content: string
  parent_id: null | ObjectId
  medias: Media[]
  // guest_views: number
  user_views: number
  created_at?: Date
  updated_at?: Date
}

export default class Post {
  _id?: ObjectId
  user_id: ObjectId
  type?: PostType
  audience: PostAudience
  content: string
  parent_id: null | ObjectId
  medias: Media[]
  // guest_views: number
  user_views: number
  created_at?: Date
  updated_at?: Date
  constructor(post: PostAType) {
    this._id = post._id
    this.user_id = post.user_id
    this.type = post.type
    this.audience = post.audience
    this.content = post.content
    this.parent_id = post.parent_id
    this.medias = post.medias
    // this.guest_views = post.guest_views
    this.user_views = post.user_views
    this.created_at = post.created_at
    this.updated_at = post.updated_at
  }
}
