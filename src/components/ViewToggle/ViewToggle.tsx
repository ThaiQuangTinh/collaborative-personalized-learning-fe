import React, { useState } from "react";
import "./ViewToggle.css";

interface ViewToggleProps {
    onChange?: (mode: "grid" | "list") => void;
    activeColor?: string;
    hoverColor?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
    onChange,
    activeColor = "#4361ee", // màu xanh dương chủ đạo
    hoverColor = "#e8f0ff",   // màu hover nhẹ
}) => {
    const [mode, setMode] = useState<"grid" | "list">("grid");

    const handleToggle = (newMode: "grid" | "list") => {
        setMode(newMode);
        onChange?.(newMode);
    };

    return (
        <div className="view-toggle">
            <button
                className={`toggle-btn ${mode === "grid" ? "active" : ""}`}
                style={{
                    background: mode === "grid" ? activeColor : "#fff",
                    color: mode === "grid" ? "#fff" : "#444",
                }}
                onClick={() => handleToggle("grid")}
            >
                <i className="fas fa-th-large"></i>
            </button>

            <button
                className={`toggle-btn ${mode === "list" ? "active" : ""}`}
                style={{
                    background: mode === "list" ? activeColor : "#fff",
                    color: mode === "list" ? "#fff" : "#444",
                }}
                onClick={() => handleToggle("list")}
            >
                <i className="fas fa-list"></i>
            </button>
        </div>
    );
};

export default ViewToggle;
