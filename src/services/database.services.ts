import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Conversation from '~/models/schemas/Conversation.schema'
import Follower from '~/models/schemas/Follower.schema'
import Post from '~/models/schemas/Post.schema'
import Call from '~/models/schemas/Call.schema'

dotenv.config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@aiiloodb.msimd.mongodb.net/?retryWrites=true&w=majority&appName=aiilooDB`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
    // } finally {
    //   // Ensures that the client will close when you finish/error
    //   await client.close()
    // }
  }

  indexUsers() {
    this.users.createIndex({ name: 'text', username: 'text' })
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKEN_COLLECTION as string)
  }

  get conversations(): Collection<Conversation> {
    return this.db.collection(process.env.DB_CONVERSATION as string)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWERS as string)
  }
  get posts(): Collection<Post> {
    return this.db.collection(process.env.DB_POSTS_COLLECTION as string)
  }

  get calls(): Collection<Call> {
    return this.db.collection(process.env.DB_CALL as string)
  }
}

const databaseService = new DatabaseService()

export default databaseService
