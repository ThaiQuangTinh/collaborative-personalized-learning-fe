import React, { useEffect, useState } from 'react';
import verifyEmailImage from '../../assets/images/verify_email.jpg';
import Button from '../../components/Button/Button';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Input from '../../components/Input/Input';
import useForm from '../../hooks/useForm';
import useRouteNavigation from '../../hooks/useNavigation';
import authService from '../../services/authService';
import { getErroMessageByCode } from '../../utils/handleError';
import { Storage } from '../../utils/storage';
import { verifyEmailValidation } from '../../utils/validation';
import './VerificationCodePage.css';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

interface VerificationCodePageProps {
    flow?: 'register' | 'forgot' | 'profile';
}

const VerificationCodePage: React.FC<VerificationCodePageProps> = (
    { flow = 'register' }) => {

    const { formData, errors, handleChange, handleBlur, setFormErrors } = useForm({
        validationCode: ''
    });

    const [remainingTime, setRemainingTime] = useState(0);
    const { toLogin, toChangePassword, toProfile } = useRouteNavigation();
    const [errMessage, setErrMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { user, updateUser } = useAuth();

    useEffect(() => {
        if (remainingTime <= 0) return;
        const timer = setTimeout(() => setRemainingTime(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [remainingTime]);

    useEffect(() => {
        setRemainingTime(60);
    }, []);

    const handleSendCode = async () => {
        if (remainingTime > 0) return;

        setRemainingTime(60);
        setFormErrors({
            ...errors,
            validationCode: ''
        });

        if (flow === 'forgot') {
            const email = Storage.get('email');
            if (email) {
                await authService.sendCodeToForgotPwd({ email });
            }
        } else {
            let userId = Storage.get('userId');

            if (!userId) {
                userId = user?.userId;
            }

            if (userId) {
                await authService.sendCodeToVerifyEmail({ userId });
            } else {
                toast.error("Không tìm thấy người dùng");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            validationCode: verifyEmailValidation('validationCode', formData.validationCode),
        };

        setFormErrors(newErrors);
        const isFormValid = Object.values(newErrors).every(msg => !msg);
        if (!isFormValid) return;

        setIsLoading(true);
        try {
            if (flow === 'forgot') {
                const email = Storage.get('email')!;
                const forgotRes = await authService.verifyForgotPwd({
                    email: email, code: formData.validationCode
                });

                if (forgotRes.success) {
                    const token = forgotRes.data?.token || '';
                    Storage.set('token', token);
                    toChangePassword();
                }
            } else {
                let userId;
                
                if (flow === 'profile') {
                    userId = user?.userId;
                } else {
                    userId = Storage.get('userId')!;
                }

                const verifyEmailRes = await authService.verifyEmail({
                    userId: userId, code: formData.validationCode
                });

                if (verifyEmailRes.success) {
                    Storage.remove('userId');
                    Storage.remove('email');
                    Storage.remove('isSendCodeToverified');
                    toast.success("Xác minh email thành công!");

                    if (flow === 'profile') {
                        updateUser({verifiedEmail: true})
                        toProfile();
                    } else {
                        toLogin();
                    }
                }
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
        <div className='verify-email-page'>
            <div className='verify-email-container'>
                <img src={verifyEmailImage} alt='' className='verify-email-image' />

                {flow === 'register'
                    ? <h2 className='form-title'>Xác minh địa chỉ email của bạn</h2>
                    : <h2 className='form-title'>Thay đổi mật khẩu của bạn</h2>
                }

                <p className='ve-info'>
                    Chúng tôi đã gửi mã xác minh đến email <span className='ve-email'>
                        {Storage.get('email') || 'user@gmail.com'}
                    </span>
                </p>
                <p className='ve-instruction'>Vui lòng nhập mã xác thực vào ô bên dưới để tiếp tục</p>

                <form className='verify-email-form' onSubmit={handleSubmit}>
                    {errMessage && (<ErrorMessage message={errMessage} />)}
                    <div className='code-input-group'>
                        <Input
                            type='text'
                            placeholder='Mã xác minh'
                            value={formData.validationCode}
                            onBlur={(e) => handleBlur(e, verifyEmailValidation)}
                            error={errors.validationCode}
                            onChange={e => {
                                handleChange(e, () => { setErrMessage('') })
                            }}
                            name='validationCode'
                        />

                        <Button
                            text={remainingTime > 0 ? `Gửi lại (${remainingTime}s)` : 'Gửi mã'}
                            variant='secondary'
                            id='btnSendCode'
                            onClick={handleSendCode}
                            disabled={remainingTime > 0}
                        />
                    </div>

                    <Button text='Tiếp tục' variant='primary' type='submit' id='btnContinue' isLoading={isLoading} margin='10px 0 0 0' />
                </form>

                <div className='ve-switch'>
                    <p>Bạn muốn đăng nhập với tài khoản khác?</p>
                    <a href='' className='form-link' onClick={toLogin}>Đăng nhập</a>
                </div>

                <div className='horizontal-line'></div>
                <p className='copyright'>© 2025 Rabbit Learning</p>
            </div>
        </div>
    );
};

export default VerificationCodePage;
