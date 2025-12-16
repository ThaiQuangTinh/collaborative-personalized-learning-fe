import { NotificationType } from '../constants/notificationType';
import { NotificationSourceType } from './../constants/notificationSourceType';

export interface NotificationResponse {
    notificationId: string,
    sourceType: NotificationSourceType,
    sourceId: string,
    message: string,
    type: NotificationType,
    metadata: string,
    isRead: boolean,
    sentAt: string,
    readAt: string
}

export interface NotificationUnreadCountResponse {
    unreadCount: number
}