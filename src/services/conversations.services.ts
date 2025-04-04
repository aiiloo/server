import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Conversation, { ConversationType } from '~/models/schemas/Conversation.schema'
import { ConversationSocketType } from '~/socket/chat.socket'

class ConversationsService {
  async getConverstations({
    sender_id,
    receiver_id,
    limit,
    page
  }: {
    sender_id: string
    receiver_id: string
    limit: number
    page: number
  }) {
    const match = {
      $or: [
        {
          sender_id: new ObjectId(sender_id),
          receiver_id: new ObjectId(receiver_id)
        },
        {
          sender_id: new ObjectId(receiver_id),
          receiver_id: new ObjectId(sender_id)
        }
      ]
    }
    const conversations = await databaseService.conversations
      .find(match)
      .sort({ created_at: -1 })
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()

    const total = await databaseService.conversations.countDocuments(match)

    return {
      conversations,
      total
    }
  }

  async createConversation({ sender_id, receiver_id, content, medias }: ConversationSocketType) {
    const conversation = new Conversation({
      sender_id: new ObjectId(sender_id),
      receiver_id: new ObjectId(receiver_id),
      content,
      medias
    })
    const result = await databaseService.conversations.insertOne(conversation)
    conversation._id = result.insertedId

    return conversation
  }
}

const conversationsService = new ConversationsService()

export default conversationsService
