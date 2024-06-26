import { ObjectId } from "mongodb";
import Notification, { NotificationConstructor } from "../models/Notification.schema";
import databaseService from "./database/database.services";

class NotificationService {
    async storeNotification(data: NotificationConstructor) {
        console.log(data)
        const notification = new Notification(data)
        return await databaseService.notifications.insertOne(notification)
    }

    async getNotificationsByUserID(userID: string, skip: number, limit: number) {
        return await databaseService.notifications.find({ to: new ObjectId(userID) }).sort({created_at: -1}).skip(skip).limit(limit).toArray()
    }
}

const notificationService = new NotificationService()
export default notificationService