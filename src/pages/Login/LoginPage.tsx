import React, { useState } from 'react';

import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';

import { Lock, User } from 'lucide-react';

import logo from '../../assets/images/logo.png';

import AuthLayout from '../../layouts/AuthLayout/AuthLayou';

import toast from 'react-hot-toast';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { ErrorCode } from '../../constants/errorCode';
import { useAuth } from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import useRouteNavigation from '../../hooks/useNavigation';
import authService from '../../services/authService';
import '../../styles/_variables.css';
import '../../styles/global.css';
import { getErroMessageByCode } from '../../utils/handleError';
import { Storage } from '../../utils/storage';
import { loginValidation } from '../../utils/validation';
import './LoginPage.css';
import { ROLE } from '../../constants/role';


const LoginPage = () => {

  const { toWelcome, toForgotPassword, toSignUp, toHome, toDashboard,
    toLearningPath, toVerifyEmail, toUserManagement, toPostManagement }
    = useRouteNavigation();

  const { formData, errors, handleChange, handleBlur, setFormErrors } = useForm({
    usernameOrEmail: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  const { setAuth } = useAuth();

  // Handle when user click to the login button
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      usernameOrEmail: loginValidation('usernameOrEmail', formData.usernameOrEmail),
      password: loginValidation('password', formData.password),
    };

    setFormErrors(newErrors);

    const isFormValid = Object.values(newErrors).every(msg => !msg);
    if (!isFormValid) return;

    setIsLoading(false);

    try {
      setIsLoading(true);
      const { usernameOrEmail, password } = formData;
      const response = await authService.login({ usernameOrEmail, password });
      if (response.success && response.data) {
        setAuth(response.data);
        if (response.data.user.role === ROLE.ADMIN) {
          toUserManagement();
        } else {
          toLearningPath();
        }
      }
    }
    catch (errRes: any) {
      const code = errRes?.error?.code;

      if (code === ErrorCode.EMAIL_NOT_VERIFIED) {
        const { userId, email } = errRes.data;
        Storage.set('userId', userId);
        Storage.set('email', email);

        authService.sendCodeToVerifyEmail({ userId: userId })
          .catch(err => toast.error("Gửi mã xác thực thất bại"));

        toVerifyEmail();
        return;
      }

      setErrMessage(getErroMessageByCode(code));
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout>
      <img src={logo} alt='Rabbit Learning' className='form-logo'
        onClick={toWelcome} />
      <h2 className='form-title text-center'>Chào mừng bạn đã quay trở lại</h2>
      <p className='form-sub-title text-center'>
        Đăng nhập để mở khóa thế giới học tập của bạn
      </p>

      <form className='auth-form' onSubmit={handleSubmit}>
        {errMessage && (<ErrorMessage message={errMessage} />)}
        <Input
          icon={<User size={18} color='#999' />}
          placeholder='Tên đăng nhập hoặc email'
          value={formData.usernameOrEmail}
          onChange={handleChange}
          onBlur={(e) => handleBlur(e, loginValidation)}
          error={errors.usernameOrEmail}
          name='usernameOrEmail'
        />

        <Input
          type='password'
          icon={<Lock size={18} color='#999' />}
          placeholder='Mật khẩu'
          value={formData.password}
          name='password'
          onBlur={(e) => handleBlur(e, loginValidation)}
          error={errors.password}
          onChange={handleChange}
        />

        <div className='login-options'>
          <a className='forgot-link form-link'
            onClick={toForgotPassword}>Quên mật khẩu?</a>
        </div>

        <Button text='Đăng nhập' variant='primary' type='submit' isLoading={isLoading} margin='10px 0 0 0' />

        <p className='register-text'>
          Bạn chưa có tài khoản? <a className='form-link'
            onClick={toSignUp}>Đăng ký ngay</a>
        </p>

        <div className='horizontal-line'></div>
      </form>

      <p className='copyright'>© 2025 Rabbit Learning</p>
    </AuthLayout>
  );
};

export default LoginPage;