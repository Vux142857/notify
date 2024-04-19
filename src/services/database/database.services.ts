import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb'
import Follow from '../../models/Follow.schema'
import Notification from '../../models/Notification.schema'

class DatabaseService {
  private client: MongoClient
  private db: Db
  private uri: string

  constructor() {
    this.uri = process.env.DATABASE_URI as string
    this.client = new MongoClient(this.uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true
      }
    })
    this.db = this.client.db(process.env.DATABASE_NAME as string)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } finally {
      // await this.client.close()
    }
  }

  get follows(): Collection<Follow> {
    return this.db.collection("follows")
  }

  get notifications(): Collection<Notification> {
    return this.db.collection("notifications")
  }

  async indexesNotification() {
    try {
      const checkExisted = await this.notifications.indexExists(['to_1'])
      if (!checkExisted) {
        this.notifications.createIndex({ to: 1 })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
const databaseService = new DatabaseService()
export default databaseService
