import { Request, Response } from "express"
import notificationService from "../services/notification.services"
import HTTP_STATUS from "../const/httpStatus"

export const getNotifications = async (req: Request, res: Response) => {
    const { decoded_authorization } = req
    const { user_id } = decoded_authorization
    const notifications = await notificationService.getNotificationsByUserID(user_id)
    const status = notifications.length > 0 ? HTTP_STATUS.OK : HTTP_STATUS.NO_CONTENT
    const result = notifications.length > 0 ? notifications : { message: 'No notifications found' }
    res.status(status).json({result})
}