import express from 'express'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHanlder } from './middlewares/erros.middlewares'
import path from 'path'

const app = express()
const port = 5000

databaseService.connect()
app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'assets/images')))

app.use('/users', usersRouter)

app.use(defaultErrorHanlder)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
