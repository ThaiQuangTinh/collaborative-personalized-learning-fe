import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
    className?: string;
    thickness?: 'normal' | 'thick';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    color = '#3b82f6',
    className = '',
    thickness = 'normal',
}) => {
    const sizeClass = `loading-spinner ${size}`;
    const thicknessClass = thickness === 'thick' ? 'thick' : '';
    
    return (
        <div className={`loading-spinner-container ${className}`}>
            <div
                className={`${sizeClass} ${thicknessClass}`}
                style={{ borderTopColor: color }}
            ></div>
        </div>
    );
};

export default LoadingSpinner;