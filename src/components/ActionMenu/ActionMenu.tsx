import React, { useState, useRef, useEffect } from "react";
import "./ActionMenu.css";

const ActionMenu: React.FC = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="action-dropdown" ref={menuRef}>
            <button className="action-dropdown-btn" onClick={() => setOpen(!open)}>
                <i className="fas fa-ellipsis-v"></i>
            </button>

            {open && (
                <div className="action-dropdown-menu">
                    <div className="action-dropdown-item">
                        <i className="fas fa-pen"></i>
                        <span>Chỉnh sửa</span>
                    </div>
                    <div className="action-dropdown-item">
                        <i className="fas fa-copy"></i>
                        <span>Sao chép</span>
                    </div>
                    <div className="action-dropdown-item">
                        <i className="fas fa-share-alt"></i>
                        <span>Chia sẻ</span>
                    </div>
                    <div className="action-dropdown-item">
                        <i className="fas fa-trash"></i>
                        <span>Xóa</span>
                    </div>
                    <div className="action-dropdown-item">
                        <i className="fas fa-archive"></i>
                        <span>Lưu trữ</span>
                    </div>
                    <div className="action-dropdown-item">
                        <i className="fas fa-file-export"></i>
                        <span>Xuất JSON</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionMenu;
