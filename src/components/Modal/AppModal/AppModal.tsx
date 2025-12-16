import React from 'react';
import './AppModal.css';

interface AppModalProps {
    isOpen: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
    padding?: string;
    modalClassName?: string;
    contentClassName?: string;
}

const AppModal: React.FC<AppModalProps> = ({ 
    isOpen, 
    title, 
    onClose, 
    children,
    padding = '30px 40px 20px 40px',
    modalClassName = '',
    contentClassName = ''
}) => {
    if (!isOpen) return null;

    return (
        <div className="app-modal-overlay" onClick={onClose}>
            <div 
                className={`app-modal ${modalClassName}`} 
                onClick={(e) => e.stopPropagation()}
                style={{ padding }}
            >
                {/* Header: title + close button */}
                {title && (
                    <div className="app-modal-header">
                        <h3 className="app-modal-title">{title}</h3>
                        <button 
                            className="app-modal-close" 
                            onClick={onClose} 
                            aria-label="Close modal"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                )}

                <div className={`app-modal-content ${contentClassName}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AppModal;