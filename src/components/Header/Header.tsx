import "@fortawesome/fontawesome-free/css/all.min.css";
import { Moon, Sun } from "lucide-react";
import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import { useAuth } from "../../hooks/useAuth";
import useRouteNavigation from "../../hooks/useNavigation";
import ButtonIcon from "../ButtonIcon/ButtonIcon";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";
import './Header.css';
import { useNotification } from "../../contexts/NotificationContext";

interface AppHeaderProps {
    onToggleSidebar?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onToggleSidebar }) => {
    const [isClosedSidebar, setIsClosedSidebar] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isOpenNotification, setIsOpenNotification] = useState(false);

    const { user } = useAuth();

    const { toProfile } = useRouteNavigation();

    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotification();

    const handleToggleSidebar = () => {
        setIsClosedSidebar(!isClosedSidebar);
        if (onToggleSidebar) {
            onToggleSidebar();
        }
    };

    const handleToggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="app-header-container">
            <div className="header-left">
                <div className="toggle-button-panel">
                    <ButtonIcon
                        icon={`fas ${isClosedSidebar ? 'fa-bars' : 'fa-times'}`}
                        className="toggle-button"
                        onClick={handleToggleSidebar}
                        tooltipId="sidebar-tooltip"
                        tooltipContent={isClosedSidebar ? "Mở sidebar" : "Đóng sidebar"}
                    />
                </div>

                <div className="user-panel">
                    <div className="user-avatar" onClick={() => { toProfile() }}>
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.fullName} />
                        ) : (
                            <span className="avatar-placeholder">
                                {user?.fullName?.charAt(0).toUpperCase()}
                            </span>
                        )}
                        {/* Hiển thị cảnh báo email chưa xác thực */}
                        {user && !user.verifiedEmail && (
                            <div className="email-warning-badge" title="Email chưa được xác thực">
                                <i className="fas fa-exclamation-triangle"></i>
                            </div>
                        )}
                    </div>
                    <div className="user-info">
                        Xin chào, <span className="user-name">{user?.fullName}</span>
                        {user && !user.verifiedEmail && (
                            <div className="email-warning-text">
                                <span className="warning-message">Email chưa xác thực</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="header-right">
                <div className="theme-mode">
                    <button
                        className="toggle-button"
                        onClick={handleToggleTheme}
                        data-tooltip-id="theme-tooltip"
                        data-tooltip-content={!isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
                    >
                        {!isDarkMode ? <Sun size={21} /> : <Moon size={21} />}
                    </button>
                </div>

                <div className="notify-panel">
                    <button
                        className="notify-button"
                        data-tooltip-id="notify-tooltip"
                        data-tooltip-content="Thông báo"
                        onClick={() => setIsOpenNotification(!isOpenNotification)}
                    >
                        <i className="fas fa-bell"></i>
                        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                    </button>

                    <NotificationDropdown
                        open={isOpenNotification}
                        onClose={() => setIsOpenNotification(false)}
                    />
                </div>
            </div>

            <Tooltip id="sidebar-tooltip" place="bottom-start" />
            <Tooltip id="theme-tooltip" place="left" />
            <Tooltip id="notify-tooltip" place="left" />
        </div>
    );
}

export default AppHeader;