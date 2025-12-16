import React from 'react';
import './ButtonIcon.css';

interface ButtonIconProps {
    icon: string;
    text?: string;
    onClick?: (e: any) => void;
    size?: number;
    color?: string;
    background?: string;
    hoverColor?: string;
    tooltipId?: string;
    tooltipContent?: string;
    className?: string;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({
    icon,
    text,
    onClick,
    size = 18,
    color = '#333',
    background = 'transparent',
    hoverColor,
    tooltipId,
    tooltipContent,
    className
}) => {
    return (
        <button
            className={`button-icon ${className ?? ''}`}
            onClick={onClick}
            style={{
                color,
                backgroundColor: background,
                '--icon-button-hover-color': hoverColor || '#237fbd'
            } as React.CSSProperties}
            data-tooltip-id={tooltipId}
            data-tooltip-content={tooltipContent}
        >
            <i className={icon} style={{ fontSize: size }}></i>
            {text && <span className="button-icon-text">{text}</span>}
        </button>
    );
};

export default ButtonIcon;
