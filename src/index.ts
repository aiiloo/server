import express from 'express'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHanlder } from './middlewares/erros.middlewares'
const app = express()
const port = 4000

databaseService.connect()
app.use(express.json())

app.use('/users', usersRouter)

app.use(defaultErrorHanlder)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
