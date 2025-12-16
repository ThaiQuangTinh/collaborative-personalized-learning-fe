import { ApiResponse } from "../types/common";
import { NotificationResponse, NotificationUnreadCountResponse } from "../types/notification";
import api from "./api";

const NOTIFICATION_BASE = "/api/notifications";

class NotificationService {

    // Delete notification by id.
    async deleteNotificationById(notificationId: string): Promise<ApiResponse<null>> {
        return api.delete(`${NOTIFICATION_BASE}/${notificationId}`);
    }

    // Mark as read notification by id.
    async markAsReadNotificationById(notificationId: string): Promise<ApiResponse<null>> {
        return api.patch(`${NOTIFICATION_BASE}/${notificationId}/read`);
    }

    // Mark as all read notification.
    async markAsAllReadNotification(): Promise<ApiResponse<null>> {
        return api.patch(`${NOTIFICATION_BASE}/read`);
    }

    // Get lastest notification.
    async getLastestNotifications():
        Promise<ApiResponse<NotificationResponse[]>> {

        return api.get(`${NOTIFICATION_BASE}/latest`);
    }

    // Get unread count notificaion.
    async getUnreadCountNotification():
        Promise<ApiResponse<NotificationUnreadCountResponse>> {

        return api.get(`${NOTIFICATION_BASE}/unread-count`);
    }

    // Delete all notificaion.
    async deleteAllNotifications():
        Promise<ApiResponse<null>> {

        return api.delete(`${NOTIFICATION_BASE}/all`);
    }
}

const notificationService = new NotificationService();

export default notificationService;