import React from "react";

import './ErrorMessage.css';

import { Info } from "lucide-react";

interface ErrorMessageProps {
    message?: string,
    className?: string,
    id?: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    className,
    id
}) => {

    return (
        <div className={`err-message-wrapper ${className ?? ''}`} id={id}>
            <div className='err-message-contaner'>
                <Info size={18} color='#e7443c' />
                <p>{message ?? 'Đã có lỗi xảy ra, vui lòng thử lại!'}</p>
            </div>
        </div>
    );
}

export default ErrorMessage;