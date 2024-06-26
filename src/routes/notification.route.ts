import { Router } from 'express'
import { accessTokenValidator } from '../middlewares/accessToken.middlewares'
import { wrapAsync } from '../utils/handler'
import { getNotifications } from '../controllers/notification.controller'
const notificationRouter = Router()

notificationRouter.get('/', accessTokenValidator, wrapAsync(getNotifications))

export default notificationRouter