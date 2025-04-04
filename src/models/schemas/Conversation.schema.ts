import { ObjectId } from 'mongodb'
import { MediaConversationType } from '~/constants/enums'

export interface ConversationType {
  _id?: ObjectId
  sender_id: ObjectId
  receiver_id: ObjectId
  content?: string
  medias?: MediaConversationType[]
  created_at?: Date
  updated_at?: Date
}

export default class Conversation {
  _id?: ObjectId
  sender_id: ObjectId
  receiver_id: ObjectId
  content?: string
  medias?: MediaConversationType[]
  created_at?: Date
  updated_at?: Date

  constructor({ _id, sender_id, receiver_id, content, medias, created_at, updated_at }: ConversationType) {
    const date = new Date()

    this._id = _id
    this.sender_id = sender_id
    this.receiver_id = receiver_id
    this.content = content
    this.medias = medias
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
