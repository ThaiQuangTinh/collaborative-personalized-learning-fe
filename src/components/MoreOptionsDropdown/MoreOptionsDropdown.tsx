import React, { useState, useRef, useEffect } from "react";
import "./MoreOptionsDropdown.css";

export interface DropdownItem {
    icon?: string;
    label: string;
    onClick?: () => void;
}

interface MoreOptionsDropdownProps {
    className?: string;
    items: DropdownItem[];
}

const MoreOptionsDropdown: React.FC<MoreOptionsDropdownProps> = ({
    className, items
}) => {

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen(!open);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`more-options ${className}`} ref={ref}>
            <button className="more-btn" onClick={toggle}>
                <i className="fas fa-ellipsis-v"></i>
            </button>

            <div className={`dropdown-menu ${open ? "show" : ""}`}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="dropdown-item"
                        onClick={(e) => {
                            e.stopPropagation();
                            item.onClick?.();
                            setOpen(false);
                        }}
                    >
                        {item.icon && <i className={item.icon}></i>} {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoreOptionsDropdown;
