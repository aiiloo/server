import express from 'express'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import postsRouter from './routes/post.routes'
import { defaultErrorHanlder } from './middlewares/erros.middlewares'
import path from 'path'
import cors from 'cors'
import { config } from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import conversationsRouter from './routes/conversations.routes'
import followersRouter from './routes/followers.routes'
import { initSocket } from './socket'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import './utils/s3'
config()

initFolder()

const app = express()
const httpServer = createServer(app)
app.use(cors())
const port = process.env.PORT || 4000

databaseService.connect().then(() => {
  databaseService.indexUsers()
})
app.use(express.json())

app.use('/assets/images', express.static(path.join(__dirname, '../src/assets/images')))

app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/medias', mediasRouter)
app.use('/conversations', conversationsRouter)

app.use('/followers', followersRouter)

app.use(defaultErrorHanlder)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

initSocket(io)

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
