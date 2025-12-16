import React from "react";
import "./TextArea.css";

interface TextAreaProps {
    placeholder?: string;
    value?: string;
    name?: string;
    error?: string;
    readOnly?: boolean;
    rows?: number;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;

    // Tùy chỉnh giao diện
    padding?: string;
    margin?: string;
    width?: string;
    height?: string;
    backgroundColor?: string;
    border?: string;
    focusColor?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
    placeholder = "",
    value,
    name,
    error,
    readOnly,
    rows = 4,
    onChange,
    onBlur,
    padding,
    margin,
    width,
    height,
    backgroundColor,
    border,
    focusColor
}) => {
    return (
        <div
            className="textarea-wrapper"
            style={{ margin }}
        >
            <div
                className={`textarea-container ${error ? "textarea-error" : ""}`}
                style={
                    {
                        "--txt-area-focus-color": focusColor || "4361ee",
                        padding,
                        margin,
                        width,
                        height,
                        backgroundColor,
                        border
                    } as React.CSSProperties
                }
            >
                <textarea
                    className="textarea-field"
                    placeholder={placeholder}
                    value={value}
                    name={name}
                    rows={rows}
                    onChange={onChange}
                    onBlur={onBlur}
                    readOnly={readOnly}
                />
            </div>
            {error && <p className="textarea-error-text">{error}</p>}
        </div>
    );
};

export default TextArea;
