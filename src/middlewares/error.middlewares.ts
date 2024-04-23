import { Request, NextFunction, Response } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '../const/httpStatus'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(err, ['status']))
}
