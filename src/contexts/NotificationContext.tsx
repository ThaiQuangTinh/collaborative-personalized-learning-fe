import React, { createContext, useContext, useEffect, useState } from "react";
import { NotificationResponse } from "../types/notification";
import notificationService from "../services/notificationService";
import { useAuth } from "../hooks/useAuth";
import userService from "../services/userService";
import useNotificationSocket from "../hooks/useNotificationSocket";

interface NotificationContextValue {
    notifications: NotificationResponse[];
    unreadCount: number;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    deleteAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
    undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useNotificationSocket(setNotifications);

    const fetchNotifications = async () => {
        if (!user) return;

        const res = await userService.getAllNotifications();
        if (res.success && res.data) {
            const sorted = [...res.data].sort(
                (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
            );
            setNotifications(sorted);
        }
    };

    const markAsRead = async (notificationId: string) => {
        const res = await notificationService.markAsReadNotificationById(notificationId);
        if (res.success) {
            setNotifications(prev => {
                if (!prev) return prev;

                return prev.map(n => {
                    if (n.notificationId === notificationId) {
                        return {
                            ...n,
                            isRead: true
                        }
                    } else {
                        return n;
                    }
                })
            });
        }
    };

    const markAllAsRead = async () => {
        const res = await notificationService.markAsAllReadNotification();
        if (res.success) {
            setNotifications(prev => {
                if (!prev) return prev;

                return prev.map(n => ({
                    ...n,
                    isRead: true
                }));
            });
        }
    };

    const deleteNotification = async (notificationId: string) => {
        const res = await notificationService.deleteNotificationById(notificationId);
        if (res.success) {
            setNotifications(prev => {
                if (!prev) return prev;

                return prev.filter(n => n.notificationId !== notificationId);
            })
        }
    };

    const deleteAllNotifications = async () => {
        try {
            const res = await notificationService.deleteAllNotifications();
            if (res.success) {
                setNotifications([]);
            }
        } catch {

        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    useEffect(() => {
        const count = notifications.filter(n => !n.isRead).length;
        setUnreadCount(count);
    }, [notifications]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                fetchNotifications,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                deleteAllNotifications
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error("useNotification must be used within NotificationProvider");
    }
    return ctx;
};