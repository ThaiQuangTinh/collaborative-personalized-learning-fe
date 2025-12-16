import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useState } from "react";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/images/logo.png';
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import ConfirmModal from "../Modal/ConfirmModal/ConfirmModal";
import "./Sidebar.css";

interface AppSidebarProps {
    collapsed: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed }) => {
    const [activeItem, setActiveItem] = useState("dashboard");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const { user, clearAuth } = useAuth();

    // const sections = ["TỔNG QUAN", "HỌC TẬP CÁ NHÂN", "CỘNG ĐỒNG", "THỐNG KÊ", "TÀI KHOẢN"];
    const userSections = ["HỌC TẬP CÁ NHÂN", "CỘNG ĐỒNG", "THỐNG KÊ", "TÀI KHOẢN"];
    const adminSections = ["NGUỜI DÙNG", "BÀI ĐĂNG", "TÀI KHOẢN"];

    const userMenuItems = [
        // { key: "dashboard", label: "Dashboard", icon: "fa-home", section: "TỔNG QUAN" },
        { key: "learning-path", label: "Lộ trình học tập", icon: "fa-route", section: "HỌC TẬP CÁ NHÂN" },
        // { key: "study-group", label: "Nhóm học tập", icon: "fa-user-group", section: "HỌC NHÓM" },
        // { key: "group-chat", label: "Trò chuyện nhóm", icon: "fa-comments", section: "HỌC NHÓM" },
        { key: "learning-feed", label: "Cộng đồng học tập", icon: "fa-comments", section: "CỘNG ĐỒNG" },
        { key: "learning-progress", label: "Tiến độ học tập", icon: "fa-chart-line", section: "THỐNG KÊ" },
        // { key: "schedule", label: "Lịch học", icon: "fa-calendar-days", section: "THỐNG KÊ" },
        { key: "notifications", label: "Thông báo", icon: "fa-bell", section: "TÀI KHOẢN" },
        { key: "profile", label: "Hồ sơ cá nhân", icon: "fa-user", section: "TÀI KHOẢN" },
        { key: "settings", label: "Cài đặt", icon: "fa-gear", section: "TÀI KHOẢN" },
        { key: "logout", label: "Đăng xuất", icon: "fa-right-from-bracket", section: "TÀI KHOẢN" }
    ];

    const adminMenuItems = [
        { key: "user-management", label: "Quản lý người dùng", icon: "fa-solid fa-user", section: "NGUỜI DÙNG" },
        { key: "post-management", label: "Quản lý bài đăng", icon: "fa-comments", section: "BÀI ĐĂNG" },
        { key: "notifications", label: "Thông báo", icon: "fa-bell", section: "TÀI KHOẢN" },
        { key: "profile", label: "Hồ sơ cá nhân", icon: "fa-user", section: "TÀI KHOẢN" },
        { key: "settings", label: "Cài đặt", icon: "fa-gear", section: "TÀI KHOẢN" },
        { key: "logout", label: "Đăng xuất", icon: "fa-right-from-bracket", section: "TÀI KHOẢN" }
    ];

    type MenuType = {
        sections: string[];
        menuItems: {
            key: string;
            label: string;
            icon: string;
            section: string;
        }[];
    };

    const [menu, setMenu] = useState<MenuType>({
        sections: userSections,
        menuItems: userMenuItems,
    });

    const handleItemClick = (key: string) => {
        if (key === "logout") {
            setShowLogoutModal(true);
            return;
        }

        setActiveItem(key);
        navigate(key);
    };

    const confirmLogout = () => {
        clearAuth();
        navigate(ROUTES.LOGIN, { replace: true });
    };

    useEffect(() => {
        if (!user) return;

        if (user.role === "ADMIN") {
            setMenu({
                sections: adminSections,
                menuItems: adminMenuItems
            });
        } else {
            setMenu({
                sections: userSections,
                menuItems: userMenuItems
            });
        }
    }, [user]);

    return (
        <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
            <Sidebar
                width="250px"
                collapsedWidth="80px"
                backgroundColor="#ffffff"
                collapsed={collapsed}
                rootStyles={{
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    zIndex: 1000,
                    borderRight: '1px solid #f0f0f0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
            >
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <img src={logo} alt="R" />
                    </div>
                    {!collapsed && <h3 className="sidebar-title">Rabbit Learning</h3>}
                </div>

                <div className="sidebar-content">
                    {menu.sections.map((section) => (
                        <div key={section}>
                            {!collapsed && <div className="sidebar-section">{section}</div>}
                            <Menu>
                                {menu.menuItems
                                    .filter(item => item.section === section)
                                    .map(item => (
                                        <MenuItem
                                            key={item.key}
                                            icon={<i className={`fas ${item.icon}`}></i>}
                                            className={`menu-item ${activeItem === item.key ? "active" : ""}`}
                                            onClick={() => handleItemClick(item.key)}
                                        >
                                            {!collapsed && item.label}
                                        </MenuItem>
                                    ))
                                }
                            </Menu>
                        </div>
                    ))}
                </div>
            </Sidebar>

            {/* Modal xác nhận đăng xuất */}
            <ConfirmModal
                isOpen={showLogoutModal}
                title="Xác nhận đăng xuất"
                message="Bạn có chắc chắn muốn đăng xuất không?"
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
            />
        </div>
    );
};

export default AppSidebar;
