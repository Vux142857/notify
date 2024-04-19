import databaseService from './database/database.services'
import { verifyToken } from '../utils/jwt'

class TokenService {

  async decodeAccessToken(access_token: string) {
    return await verifyToken({ token: access_token, secretKey: process.env.JWT_SECRET_ACCESS_TOKEN as string })
  }
}

const tokenService = new TokenService()

export default tokenService
