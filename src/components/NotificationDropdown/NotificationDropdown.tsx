import React, { useEffect, useRef, useState } from 'react';
import useRouteNavigation from '../../hooks/useNavigation';
import { NotificationResponse } from '../../types/notification';
import './NotificationDropdown.css';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
    open: boolean;
    onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
    open,
    onClose,
}) => {
    const { toNotification } = useRouteNavigation();

    const { notifications, unreadCount, markAsRead } = useNotification();

    const [lastestNotifications, setLastestNotification] = useState<NotificationResponse[]>([]);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    useEffect(() => {
        setLastestNotification(notifications.slice(0, 3));
    }, [notifications]);

    if (!open) return null;

    return (
        <div className="ndp-dropdown">
            <div className="ndp-overlay" onClick={onClose} />

            <div className="ndp-content" ref={dropdownRef}>
                <div className="ndp-header">
                    <h3>Thông báo</h3>
                    {unreadCount > 0 && (
                        <span className="ndp-unread-badge">{unreadCount} chưa đọc</span>
                    )}
                </div>

                <div className="ndp-list">
                    {lastestNotifications.length === 0 ? (
                        <div className="ndp-empty">
                            <i className="fas fa-bell-slash"></i>
                            <p>Không có thông báo mới</p>
                        </div>
                    ) : (
                        lastestNotifications.map(n => (
                            <div
                                key={n.notificationId}
                                className={`ndp-item ${!n.isRead ? 'unread' : ''}`}
                                onClick={() => {
                                    markAsRead(n.notificationId);
                                    onClose();
                                    navigate(`/learning-feed?id=${n.sourceId}`);
                                }}
                            >
                                <div className="ndp-icon">
                                    <i className="fas fa-bell"></i>
                                </div>

                                <div className="ndp-content-text">
                                    <p className="ndp-message">{n.message}</p>
                                    {/* <span className="ndp-time">{n.time}</span> */}
                                </div>

                                {!n.isRead && <div className="ndp-dot" />}
                            </div>
                        ))
                    )}
                </div>

                {notifications.length !== 0 && (
                    <div className="ndp-footer">
                        <button className="ndp-view-all" onClick={() => {
                            toNotification();
                            onClose();
                        }}>
                            Xem tất cả thông báo</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;
