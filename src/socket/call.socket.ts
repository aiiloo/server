import { Server, Socket } from 'socket.io'

const users: Record<string, { socket_id: string }> = {}
export const initCallSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    const user_id = socket.handshake.auth._id
    users[user_id] = { socket_id: socket.id }

    socket.on('call_user', (data) => {
      const { receiver_id, offer, callerInfo } = data.payload
      const receiver_socket_id = users[receiver_id]?.socket_id
      console.log('receiver_socket_id: ', receiver_socket_id)
      console.log('offer: ', offer)
      if (receiver_socket_id) {
        socket.to(receiver_socket_id).emit('incoming_call', {
          from: user_id,
          offer,
          callerInfo
        })
      }
    })

    socket.on('answer_call', ({ receiver_id, answer }) => {
      const receiver_socket_id = users[receiver_id]?.socket_id
      if (receiver_socket_id) {
        socket.to(receiver_socket_id).emit('call_answered', {
          from: user_id,
          answer
        })
      }
    })

    socket.on('reject_call', ({ receiver_id }) => {
      const receiver_socket_id = users[receiver_id]?.socket_id
      if (receiver_socket_id) {
        socket.to(receiver_socket_id).emit('call_rejected', {
          from: user_id
        })
      }
    })

    socket.on('ice_candidate', ({ receiver_id, candidate }) => {
      const receiver_socket_id = users[receiver_id]?.socket_id
      if (receiver_socket_id) {
        socket.to(receiver_socket_id).emit('ice_candidate', {
          from: user_id,
          candidate
        })
      }
    })

    socket.on('cancel_call', ({ receiver_id }) => {
      const receiver_socket_id = users[receiver_id]?.socket_id
      if (receiver_socket_id) {
        socket.to(receiver_socket_id).emit('call_cancelled', {
          from: user_id
        })
      }
    })

    socket.on('disconnect', () => {
      delete users[user_id]
    })
  })
}
