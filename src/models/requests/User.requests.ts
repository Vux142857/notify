import { JwtPayload } from 'jsonwebtoken'
export interface TokenPayload extends JwtPayload {
  token: string
  user_id: string
  exp: number
  iat: number
}