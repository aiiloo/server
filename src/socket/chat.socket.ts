import { Server, Socket } from 'socket.io'
import { ConversationStatus, MediaConversationType } from '~/constants/enums'
import conversationsService from '~/services/conversations.services'

export interface ConversationSocketType {
  _id?: string
  sender_id: string
  receiver_id: string
  content?: string
  medias?: MediaConversationType[]
  status?: ConversationStatus.SENT
  created_at?: string
  updated_at?: string
}

const users: Record<string, { socket_id: string }> = {}

export const initChatSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    // console.log(`User ${socket.id} connected`)
    const user_id = socket.handshake.auth._id
    users[user_id] = { socket_id: socket.id }
    // console.log(users)
    socket.on('send_message', async (data) => {
      const { receiver_id, sender_id, content, medias } = data.payload as ConversationSocketType
      const receiver_socket_id = users[receiver_id]?.socket_id
      // console.log('Payload data: ', data.payload)
      // if (!receiver_socket_id) return

      const conversation = await conversationsService.createConversation({ sender_id, receiver_id, content, medias })
      console.log('conversation: ', conversation)
      socket.to(receiver_socket_id).emit('receive_message', { payload: conversation, from: user_id })
    })

    socket.on('disconnect', () => {
      delete users[user_id]
      console.log(`User ${socket.id} disconnected`)
    })
  })
}
