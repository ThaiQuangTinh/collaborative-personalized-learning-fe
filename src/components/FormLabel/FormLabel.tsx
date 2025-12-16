import React from "react";
import "./FormLabel.css";

interface FormLabelProps {
    text: string;
    icon?: React.ReactNode;
    required?: boolean;
    margin?: string;
    fontSize?: string;
    color?: string;
    fontWeight?: number,
    gap?: string;
    className?: string;
    id?: string;
}

const FormLabel: React.FC<FormLabelProps> = ({
    text,
    icon,
    required = false,
    margin,
    fontSize = "14px",
    color = "#444",
    fontWeight = 600,
    gap = "8px",
    className,
    id,
}) => {
    return (
        <label
            id={id}
            className={`form-label-wrapper ${className ?? ""}`}
            style={{
                margin,
                fontSize,
                color,
                gap,
                fontWeight
            }}
        >
            {icon && <span className="form-label-icon">{icon}</span>}
            <span className="form-label-text">
                {text}
                {required && <span className="form-label-required">(*)</span>}
                :
            </span>
        </label>
    );
};

export default FormLabel;
