import { Mail } from 'lucide-react';
import React, { useState } from 'react';
import forgotPasswordImage from '../../assets/images/change_password.jpg';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import useForm from '../../hooks/useForm';
import useRouteNavigation from '../../hooks/useNavigation';
import { forgotPasswordValidation } from '../../utils/validation';
import './ForgotPasswordPage.css';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { getErroMessageByCode } from '../../utils/handleError';
import authService from '../../services/authService';
import { Storage } from '../../utils/storage';

const ForgotPasswordPage: React.FC = () => {

    const { toLogin, toVerifyEmailForgot } = useRouteNavigation();

    const { formData, errors, handleChange, handleBlur, setFormErrors } = useForm({
        email: ''
    });

    const [errMessage, setErrMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        console.log("Forgot password!");
        e.preventDefault();

        const newErrors = {
            email: forgotPasswordValidation('email', formData.email),
        };

        setFormErrors(newErrors);

        const isFormValid = Object.values(newErrors).every(msg => !msg);
        if (!isFormValid) return;

        try {
            setIsLoading(true);
            const response = await authService.sendCodeToForgotPwd({
                email: formData.email
            });

            if (response.success) {
                Storage.set('email', formData.email);
                toVerifyEmailForgot();
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
        <div className="forgot-password-page">
            <div className='forgot-password-container'>
                <img src={forgotPasswordImage} alt="Quên mật khẩu" className="fp-image" />
                <h2 className="form-title text-center">Quên mật khẩu</h2>
                <p className="form-sub-title text-center">Đặt lại mật khẩu mới để bảo vệ tài khoản của bạn</p>

                <form className="fp-form" >
                    {errMessage && (<ErrorMessage message={errMessage} />)}
                    <Input
                        icon={<Mail size={18} color='#999' />}
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={(e) => handleBlur(e, forgotPasswordValidation)}
                        error={errors.email}
                        name='email'
                    />

                    <Button text="Tiếp tục" variant="primary" type='submit' isLoading={isLoading} margin='15px 0 0 0' />
                </form>

                <div className="fp-switch">
                    <p>Bạn muốn đăng nhập với tài khoản khác?</p>
                    <a className="form-link" onClick={toLogin}>Đăng nhập</a>
                </div>

                <div className="horizontal-line"></div>
                <p className="copyright">© 2025 Rabbit Learning</p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;