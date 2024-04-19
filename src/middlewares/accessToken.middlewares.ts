import { checkSchema } from "express-validator"
import { validate } from "../utils/validation"
import { ErrorWithStatus } from "../models/Error"
import { USER_MESSAGES } from "../const/messages"
import HTTP_STATUS from "../const/httpStatus"
import tokenService from "../services/token.services"

export const accessTokenValidator = validate(
    checkSchema(
      {
        Authorization: {
          notEmpty: {
            errorMessage: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
          },
          isString: {
            errorMessage: USER_MESSAGES.ACCESS_TOKEN_INVALID
          },
          custom: {
            options: async (value: string, { req }) => {
              try {
                const accessToken = value.split(' ')[1]
                if (accessToken === '') {
                  throw new ErrorWithStatus({
                    message: USER_MESSAGES.ACCESS_TOKEN_INVALID,
                    status: HTTP_STATUS.UNAUTHORIZED
                  })
                }
                const decoded_access_token = await tokenService.decodeAccessToken(accessToken)
                req.decoded_authorization = decoded_access_token
              } catch (error) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGES.ACCESS_TOKEN_EXPIRED,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              return true
            }
          }
        }
      },
      ['headers']
    )
  )