import { ObjectId } from "mongodb";
import Notification, { NotificationConstructor } from "../models/Notification.schema";
import databaseService from "./database/database.services";

class NotificationService {
    async storeNotification(data: NotificationConstructor) {
        const notification = new Notification(data)
        return await databaseService.notifications.insertOne(notification)
    }

    async getNotificationsByUserID(userID: string) {
        return await databaseService.notifications.find({ to: new ObjectId(userID) }).toArray()
    }
}

const notificationService = new NotificationService()
export default notificationService