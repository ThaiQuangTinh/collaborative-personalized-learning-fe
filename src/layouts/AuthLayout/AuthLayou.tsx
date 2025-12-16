import React from "react";
import './AuthLayout.css';
import { Check } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children
}) => {
    return (
        <div className='auth-page'>

            {/* Half left */}
            <div className='auth-left'>
                {children}
            </div>

            {/* Half right */}
            <div className='auth-right'>
                <div className='circle top-circle'></div>
                <div className='circle bottom-circle'></div>

                <div className='head-title'>
                    <h1>Rabbit Learning</h1>
                    <p className='slogan'>
                        Cùng bạn chinh phục lộ trình học tập mỗi ngày
                    </p>
                </div>

                <ul className='features'>
                    <li><Check className='check' /> Cá nhân hóa lộ trình.</li>
                    <li><Check className='check' /> Theo dõi tiến độ</li>
                    {/* <li><Check className='check' /> Lưu trữ và quản lý tài liệu.</li> */}
                    <li><Check className='check' /> Học tập cùng với cộng đồng.</li>
                </ul>

                <blockquote className='quote'>
                    'Thành công không đến từ may mắn,<br />
                    mà từ sự kiên trì học hỏi mỗi ngày.'
                </blockquote>
            </div>
        </div>
    );
}

export default AuthLayout;