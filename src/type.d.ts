import { TokenPayload } from './models/requests/User.requests'
import { TweetConstructor } from './models/schemas/Tweet.schema'

declare module 'express' {
  interface Request {
    user_id?: string
    decoded_authorization?: TokenPayload
  }
}
