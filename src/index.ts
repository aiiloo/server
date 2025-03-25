import express from 'express'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHanlder } from './middlewares/erros.middlewares'
import path from 'path'
import cors from 'cors'
import { config } from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

config()

const app = express()
const httpServer = createServer(app)
app.use(cors())
const port = process.env.PORT || 4000

databaseService.connect()
app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'assets/images')))

app.use('/users', usersRouter)

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

  socket.on('private message', (data) => {
    const receiver_socket_id = users[data.to]?.socket_id
    socket.to(receiver_socket_id).emit('receive private message', {
      content: data.content,
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
