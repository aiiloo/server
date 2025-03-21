import express from 'express'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHanlder } from './middlewares/erros.middlewares'
import cors from 'cors'
import { config } from 'dotenv'

config()

const app = express()
app.use(cors())
const port = process.env.PORT || 4000

databaseService.connect()
app.use(express.json())

app.use('/users', usersRouter)

app.use(defaultErrorHanlder)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
