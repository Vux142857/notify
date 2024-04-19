import express from 'express'
import databaseService from './services/database/database.services'
import { defaultErrorHandler } from '../src/middlewares/error.middlewares'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import notificationRouter from './routes/notification.route'
const app = express()
app.use(helmet())
app.use(
  cors({
    origin: '*',
    credentials: true
  })
)
app.use(
  rateLimit({
    windowMs: 20 * 60 * 1000, // 20 minutes
    limit: 10000, // Limit each IP to 200 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  })
)
databaseService.connect().then(async () => {
    await databaseService.indexesNotification()
})
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.get('/', (req: any, res: any) => {
  res.send('Hello World')
})
app.use('/notitication', notificationRouter)
app.use(defaultErrorHandler)

export default app
