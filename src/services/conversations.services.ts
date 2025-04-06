import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Conversation, { ConversationType } from '~/models/schemas/Conversation.schema'
import { ConversationSocketType } from '~/socket/chat.socket'
import { ConversationStatus } from '~/constants/enums'
import { FileType } from '~/utils/file'

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
      status: ConversationStatus.SENT,
      medias
    })
    const result = await databaseService.conversations.insertOne(conversation)
    conversation._id = result.insertedId

    return conversation
  }

  async recallMessage(conversation_id: string) {
    const conversation = await databaseService.conversations.findOne({ _id: new ObjectId(conversation_id) })
    if (conversation) {
      await databaseService.conversations.updateOne(
        { _id: new ObjectId(conversation_id) },
        {
          $set: {
            status: ConversationStatus.RECALLED
          }
        }
      )
      return conversation
    }
  }

  async getConversationMedias({
    user_id,
    receiver_user_id,
    type,
    limit = 10,
    page = 1
  }: {
    user_id: string
    receiver_user_id: string
    type: FileType
    limit: number
    page: number
  }) {
    const conversation = await databaseService.conversations
      .find({
        $or: [
          {
            sender_id: new ObjectId(user_id),
            receiver_id: new ObjectId(receiver_user_id)
          },
          {
            sender_id: new ObjectId(receiver_user_id),
            receiver_id: new ObjectId(user_id)
          }
        ]
      })
      .sort({ created_at: -1 })
      .skip(limit * (page - 1))
      .toArray()
    const imageMessages = conversation
      .filter((message) => message.medias?.some((media) => media.type === type))
      .map((message) => ({
        content: message.content,
        medias: message.medias,
        created_at: message.created_at
      }))

    return imageMessages
  }
}

const conversationsService = new ConversationsService()

export default conversationsService
