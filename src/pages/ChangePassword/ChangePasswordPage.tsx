import { Lock } from 'lucide-react';
import React, { useState } from 'react';
import changePasswordImage from '../../assets/images/change_password.jpg';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import useForm from '../../hooks/useForm';
import useRouteNavigation from '../../hooks/useNavigation';
import { changePasswordValidation } from '../../utils/validation';
import './ChangePasswordPage.css';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { getErroMessageByCode } from '../../utils/handleError';
import { Storage } from '../../utils/storage';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

const ChangePasswordPage: React.FC = () => {

    const { formData, errors, handleChange, handleBlur, setFormErrors } = useForm({
        password: '',
        rePassword: ''
    });

    const [errMessage, setErrMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const { toLogin } = useRouteNavigation();

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            password: changePasswordValidation('password', formData.password, formData),
            rePassword: changePasswordValidation('rePassword', formData.rePassword, formData),
        };

        setFormErrors(newErrors);

        const isValid = Object.values(newErrors).every(msg => !msg);
        if (!isValid) return;

        try {
            const token = Storage.get('token')!;
            const email = Storage.get('email')!;
            const response = await authService.resetPassword({
                email: email, newPassword: formData.password, token: token
            });

            if (response.success) {
                Storage.remove('token');
                Storage.remove('email');
                toast.success("Thay đổi mật khẩu thành công!");
                toLogin();
            }
        }
        catch (errRes: any) {
            setErrMessage(getErroMessageByCode(errRes.error.code));
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='change-password-page-wrapper'>
            <div className="change-password-page">
                <img src={changePasswordImage} alt="Change Password" className="change-password-image" />
                <h2 className="form-title text-center">Thay đổi mật khẩu</h2>
                <p className="form-sub-title text-center">Đặt lại mật khẩu mới để bảo vệ tài khoản của bạn!</p>

                <form className="change-password-form" onSubmit={handleChangePassword}>
                    {errMessage && (<ErrorMessage message={errMessage} />)}
                    <Input
                        icon={<Lock size={18} color='#999' />}
                        type="password"
                        placeholder="Mật khẩu"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={(e) => handleBlur(e, changePasswordValidation)}
                        error={errors.password}
                        name='password'
                    />

                    <Input
                        icon={<Lock size={18} color='#999' />}
                        type="password"
                        placeholder="Nhắc lại mật khẩu"
                        value={formData.rePassword}
                        onChange={handleChange}
                        onBlur={(e) => handleBlur(e, changePasswordValidation)}
                        error={errors.rePassword}
                        name='rePassword'
                    />
                    <Button text="Tiếp tục" variant="primary" type='submit' isLoading={isLoading} margin='15px 0 0 0' />
                </form>

                <div className="cp-switch">
                    <p>Bạn muốn đăng nhập với tài khoản khác?</p>
                    <a className="form-link" onClick={toLogin}>Đăng nhập</a>
                </div>

                <div className='horizontal-line'></div>
                <p className='copyright'>© 2025 Rabbit Learning</p>
            </div>
        </div>
    );
};

export default ChangePasswordPage;