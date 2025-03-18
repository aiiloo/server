import { Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'

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
}

const databaseService = new DatabaseService()

export default databaseService
