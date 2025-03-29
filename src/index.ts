import express from 'express'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHanlder } from './middlewares/erros.middlewares'
import path from 'path'
import cors from 'cors'
import { config } from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import Conversation from './models/schemas/Conversation.schema'
import conversationsRouter from './routes/conversations.routes'
import { ObjectId } from 'mongodb'

config()

const app = express()
const httpServer = createServer(app)
app.use(cors())
const port = process.env.PORT || 4000

databaseService.connect()
app.use(express.json())

app.use('/assets/images', express.static(path.join(__dirname, '../src/assets/images')))

app.use('/users', usersRouter)

app.use('/conversations', conversationsRouter)

app.use(defaultErrorHanlder)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

const users: {
  [key: string]: {
    socket_id: string
  }
} = {}

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`)
  const user_id = socket.handshake.auth._id
  users[user_id] = {
    socket_id: socket.id
  }
  console.log('users: ', users)

  socket.on('send_message', async (data) => {
    const { receiver_id, sender_id, content } = data.payload
    const receiver_socket_id = users[receiver_id]?.socket_id
    if (!receiver_socket_id) {
      return
    }
    const conversations = new Conversation({
      sender_id: new ObjectId(sender_id),
      receiver_id: new ObjectId(receiver_id),
      content: content
    })

    const result = await databaseService.conversations.insertOne(conversations)

    conversations._id = result.insertedId

    socket.to(receiver_socket_id).emit('receive_message', {
      payload: conversations,
      from: user_id
    })
  })
  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`User ${socket.id} disconnected`)
  })
})

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
