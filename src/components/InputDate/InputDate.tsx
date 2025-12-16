import React from "react";
import "./InputDate.css";

interface InputDateProps {
    label?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    fontSize?: string;
}

const InputDate: React.FC<InputDateProps> = ({
    label,
    name,
    value,
    onChange,
    required = false,
    fontSize = "15px",
}) => {
    return (
        <div className="input-date">
            {label && (
                <label
                    htmlFor={name}
                    className="input-date-label"
                    style={{ fontSize }}
                >
                    {label} {required && <span className="required">*</span>}
                </label>
            )}
            <input
                type="date"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="input-date-field"
                style={{ fontSize }}
            />
        </div>
    );
};

export default InputDate;
