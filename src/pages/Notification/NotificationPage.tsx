// NotificationPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationType } from '../../constants/notificationType';
import { useNotification } from '../../contexts/NotificationContext';
import './NotificationPage.css';
import ConfirmModal from '../../components/Modal/ConfirmModal/ConfirmModal';


const NotificationPage: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const { notifications, unreadCount, markAsRead, deleteAllNotifications,
        markAllAsRead, deleteNotification } = useNotification();

    const [showDeleteNotificationModal, setShowDeleteNotificationModal] = useState(false);

    const navigate = useNavigate();

    const mapNotificationTypeToUI = (type: NotificationType) => {
        switch (type) {
            case NotificationType.POST_LIKED:
            case NotificationType.POST_COMMENTED:
            case NotificationType.NEW_POST:
                return { icon: 'fas fa-comment', color: '#3b82f6' };

            case NotificationType.LESSON_COMPLETED:
            case NotificationType.LEARNING_PATH_COMPLETED:
                return { icon: 'fas fa-check-circle', color: '#10b981' };

            case NotificationType.DEADLINE_REMINDER:
                return { icon: 'fas fa-exclamation-triangle', color: '#f59e0b' };

            case NotificationType.GENERAL:
            default:
                return { icon: 'fas fa-info-circle', color: '#3b82f6' };
        }
    };

    const getNotificationIcon = (type: NotificationType) => {
        return mapNotificationTypeToUI(type).icon;
    };

    const getNotificationColor = (type: NotificationType) => {
        return mapNotificationTypeToUI(type).color;
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(notification => !notification.isRead)
        : notifications;

    return (
        <div className="notification-page">
            <div className="notification-header">
                <div className="header-content">
                    <h1 className="page-title">
                        <i className="fas fa-bell"></i>
                        Thông báo
                    </h1>
                    <div className="header-stats">
                        <span className="stat-item">
                            <span className="stat-number">{unreadCount}</span>
                            <span className="stat-label">chưa đọc</span>
                        </span>
                        <span className="stat-item">
                            <span className="stat-number">{notifications.length}</span>
                            <span className="stat-label">tổng số</span>
                        </span>
                    </div>
                </div>

                <div className="header-actions">
                    <div className="noti-filter-tabs">
                        <button
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            Tất cả
                        </button>
                        <button
                            className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                            onClick={() => setFilter('unread')}
                        >
                            Chưa đọc
                        </button>
                    </div>

                    <div className='right-action'>
                        <button
                            className="mark-all-read-btn"
                            onClick={() => markAllAsRead()}
                            disabled={unreadCount === 0}
                        >
                            <i className="fas fa-check-double"></i>
                            Đánh dấu tất cả đã đọc
                        </button>

                        <button
                            className="delete-all-btn"
                            onClick={() => {
                                setShowDeleteNotificationModal(true);
                            }}
                            title="Xóa tất cả thông báo"
                            disabled={notifications.length === 0}
                        >
                            <i className="fas fa-trash-alt"></i>
                            <span>Xóa tất cả</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="notification-content">
                {filteredNotifications.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-bell-slash"></i>
                        <h3>Không có thông báo</h3>
                        <p>Khi có thông báo mới, chúng sẽ xuất hiện ở đây.</p>
                    </div>
                ) : (
                    <div className="notification-list">
                        {filteredNotifications.map(notification => (
                            <div
                                key={notification.notificationId}
                                className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                                onDoubleClick={() => {
                                    markAsRead(notification.notificationId)
                                    navigate(`/learning-feed?id=${notification.sourceId}`);
                                }}
                            >
                                <div
                                    className="notification-icon"
                                    style={{ color: getNotificationColor(notification.type) }}
                                >
                                    <i className={getNotificationIcon(notification.type)}></i>
                                </div>

                                <div className="notification-details">
                                    <div className="notification-message">
                                        {notification.message}
                                    </div>
                                    {/*
                                    <span className="notification-time">
                                        {notification.time}
                                    </span>
                                    */}
                                </div>

                                <div className="notification-actions">
                                    {/* {!notification.isRead && (
                                        <button
                                            className="action-btn mark-read-btn"
                                            onClick={() => {
                                                markAsRead(notification.notificationId)
                                                navigate(`/learning-feed?id=${notification.sourceId}`);
                                            }}
                                            title="Đánh dấu đã đọc"
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                    )} */}
                                    <button
                                        className="action-btn delete-btn"
                                        onClick={() => deleteNotification(notification.notificationId)}
                                        title="Xóa thông báo"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>

                                {!notification.isRead && (
                                    <div className="unread-indicator"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={showDeleteNotificationModal}
                title="Xác nhận xóa thông báo"
                message="Bạn có chắc chắn muốn xóo tất cả thông báo không?"
                onCancel={() => setShowDeleteNotificationModal(false)}
                onConfirm={() => {
                    deleteAllNotifications();
                    setShowDeleteNotificationModal(false);
                }}
            />
        </div>
    );
};

export default NotificationPage;