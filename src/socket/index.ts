import { Server } from 'socket.io'
import { initChatSocket } from './chat.socket'

export const initSocket = (io: Server) => {
  initChatSocket(io)
}
