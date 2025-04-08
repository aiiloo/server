import { Server } from 'socket.io'
import { initChatSocket } from './chat.socket'
import { initCallSocket } from './call.socket'

export const initSocket = (io: Server) => {
  initChatSocket(io)
  initCallSocket(io)
}
