import React from "react";
import './Button.css';

interface ButtonProps {
    text?: string;
    icon?: string;
    onClick?: () => void;
    type?: 'submit' | 'button';
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
    id?: string;
    iconSize?: string;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    size?: 'small' | 'medium' | 'large';
    margin?: string;
    padding?: string;
    backgroundColor?: string;
    textColor?: string;
    border?: string;
    fontWeight?: string;
    dataTooltipId?: string;
    dataTooltipContent?: string;
}

const Button: React.FC<ButtonProps> = ({
    text,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    isLoading,
    className,
    id,
    icon,
    iconSize,
    iconPosition = 'left',
    fullWidth = true,
    size = 'medium',
    margin,
    padding,
    backgroundColor,
    textColor,
    border,
    fontWeight,
    dataTooltipId,
    dataTooltipContent
}) => {
    const buttonClass = `btn ${variant} ${fullWidth ? 'full-width' : 'auto-width'} ${size} ${className ?? ''}`;

    const customStyle: React.CSSProperties = {
        margin: margin,
        padding: padding,
        background: backgroundColor,
        color: textColor,
        border: border,
        fontWeight: fontWeight,
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <>
                    <span className="spinner"></span>
                    <span className="btn-text">{text}</span>
                </>
            );
        }

        const iconElement = icon && (
            <i className={`${icon} btn-icon`} style={{ fontSize: iconSize || '12px' }}>

            </i>
        );

        return (
            <>
                {iconPosition === 'left' && iconElement}
                <span className="btn-text">{text}</span>
                {iconPosition === 'right' && iconElement}
            </>
        );
    };

    return (
        <button
            className={buttonClass}
            id={id}
            onClick={!isLoading ? onClick : undefined}
            disabled={disabled || isLoading}
            style={customStyle}
            data-tooltip-id={dataTooltipId}
            data-tooltip-content={dataTooltipContent}
            type={type}
        >
            {renderContent()}
        </button>
    );
};

export default Button;
