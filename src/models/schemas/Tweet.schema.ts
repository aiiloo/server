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
  guest_views: number
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
  guest_views: number
  user_views: number
  created_at?: Date
  updated_at?: Date
  constructor(tweet: PostAType) {
    this._id = tweet._id
    this.user_id = tweet.user_id
    this.type = tweet.type
    this.audience = tweet.audience
    this.content = tweet.content
    this.parent_id = tweet.parent_id
    this.medias = tweet.medias
    this.guest_views = tweet.guest_views
    this.user_views = tweet.user_views
    this.created_at = tweet.created_at
    this.updated_at = tweet.updated_at
  }
}
