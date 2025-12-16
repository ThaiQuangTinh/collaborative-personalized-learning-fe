import React, { useState } from 'react';
import toast from 'react-hot-toast';
import userService from '../../../services/userService';
import { getErroMessageByCode } from '../../../utils/handleError';
import ButtonCancel from '../../ButtonCancel/ButtonCancel';
import ButtonSave from '../../ButtonSave/ButtonSave';
import FormLabel from '../../FormLabel/FormLabel';
import Input from '../../Input/Input';
import AppModal from '../AppModal/AppModal';

interface ChangePasswordModalContentProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChangePasswordModalContent: React.FC<ChangePasswordModalContentProps> = ({
    isOpen,
    onClose,
}) => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [touched, setTouched] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const validateField = (field: string, value: string) => {
        switch (field) {
            case 'currentPassword':
                if (!value.trim()) {
                    return 'Vui lòng nhập mật khẩu hiện tại';
                }
                return '';

            case 'newPassword':
                if (!value.trim()) {
                    return 'Vui lòng nhập mật khẩu mới';
                } else if (value.length < 6) {
                    return 'Mật khẩu mới phải có ít nhất 6 ký tự';
                }
                return '';

            case 'confirmPassword':
                if (!value.trim()) {
                    return 'Vui lòng xác nhận mật khẩu mới';
                } else if (value !== passwords.newPassword) {
                    return 'Mật khẩu xác nhận không khớp';
                }
                return '';

            default:
                return '';
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setPasswords(prev => ({
            ...prev,
            [field]: value
        }));

        // Validate real-time nếu field đã được touched
        if (touched[field as keyof typeof touched]) {
            const error = validateField(field, value);
            setErrors(prev => ({
                ...prev,
                [field]: error
            }));
        }
    };

    const handleInputBlur = (field: string, value: string) => {
        // Đánh dấu field đã được touched
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));

        // Validate field khi blur
        const error = validateField(field, value);
        setErrors(prev => ({
            ...prev,
            [field]: error
        }));
    };

    const validateForm = () => {
        const newErrors = {
            currentPassword: validateField('currentPassword', passwords.currentPassword),
            newPassword: validateField('newPassword', passwords.newPassword),
            confirmPassword: validateField('confirmPassword', passwords.confirmPassword)
        };

        setErrors(newErrors);

        // Đánh dấu tất cả fields là đã touched để hiển thị lỗi
        setTouched({
            currentPassword: true,
            newPassword: true,
            confirmPassword: true
        });

        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const res = await userService.changeUserPassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });

            if (res.success) {
                onClose();
                toast.success("Đổi mật khẩu thành công!");
            }
        } catch (errRes: any) {
            toast.error(getErroMessageByCode(errRes.error.code));
        }
    };

    const handleClose = () => {
        setPasswords({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setTouched({
            currentPassword: false,
            newPassword: false,
            confirmPassword: false
        });
        onClose();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <AppModal
            isOpen={isOpen}
            title="Đổi mật khẩu"
            onClose={handleClose}
        >
            <div className="change-password-modal-content" onKeyPress={handleKeyPress}>
                <div className="password-form">
                    <div className="form-group">
                        <FormLabel text='Mật khẩu hiện tại' required margin='0 0 10px 0' />
                        <Input
                            type="password"
                            value={passwords.currentPassword}
                            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                            onBlur={(e) => handleInputBlur('currentPassword', e.target.value)}
                            placeholder="Nhập mật khẩu hiện tại"
                            error={errors.currentPassword}
                            padding="12px 15px"
                            margin="0 0 20px 0"
                            focusColor='#3498db'
                        />
                    </div>

                    <div className="form-group">
                        <FormLabel text='Mật khẩu mới' required margin='0 0 10px 0' />
                        <Input
                            type="password"
                            value={passwords.newPassword}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                            onBlur={(e) => handleInputBlur('newPassword', e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            error={errors.newPassword}
                            padding="12px 15px"
                            margin="0 0 20px 0"
                            focusColor='#3498db'
                        />
                    </div>

                    <div className="form-group">
                        <FormLabel text='Xác nhận mật khẩu mới' required margin='0 0 10px 0' />
                        <Input
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            onBlur={(e) => handleInputBlur('confirmPassword', e.target.value)}
                            placeholder="Xác nhận mật khẩu mới"
                            error={errors.confirmPassword}
                            padding="12px 15px"
                            margin="0 0 30px 0"
                            focusColor='#3498db'
                        />
                    </div>

                    <div className="modal-actions">
                        <ButtonCancel onClick={handleClose} />
                        <ButtonSave onClick={handleSubmit} text='Xác nhận' />
                    </div>
                </div>
            </div>
        </AppModal>
    );
};

export default ChangePasswordModalContent;