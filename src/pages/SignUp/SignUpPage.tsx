import React, { useState } from 'react';

import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';

import { Lock, Mail, User } from 'lucide-react';

import logo from '../../assets/images/logo.png';
import './SignUpPage.css';

import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import useForm from '../../hooks/useForm';
import useRouteNavigation from '../../hooks/useNavigation';
import AuthLayout from '../../layouts/AuthLayout/AuthLayou';
import authService from '../../services/authService';
import { getErroMessageByCode } from '../../utils/handleError';
import { signUpValidation } from '../../utils/validation';
import { Storage } from '../../utils/storage';
import toast from 'react-hot-toast';


const SignUpPage: React.FC = () => {

  const { toWelcome, toLogin, toVerifyEmail } = useRouteNavigation();

  const { formData, errors, handleChange, handleBlur, setFormErrors } = useForm({
    username: '',
    email: '',
    password: '',
    rePassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');


  // Handle when user click to the register button
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      username: signUpValidation('username', formData.username, formData),
      email: signUpValidation('email', formData.email, formData),
      password: signUpValidation('password', formData.password, formData),
      rePassword: signUpValidation('rePassword', formData.rePassword, formData),
    };

    setFormErrors(newErrors);

    const isFormValid = Object.values(newErrors).every(msg => !msg);

    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const { username, email, password } = formData;
      const registerRes = await authService.register({ username, email, password });
      if (registerRes.success && registerRes.data) {
        Storage.set('userId', registerRes.data.userId);
        Storage.set('email', registerRes.data.email);
        toVerifyEmail();

        authService.sendCodeToVerifyEmail({ userId: registerRes.data.userId })
          .catch(err => toast.error("Gửi mã xác thực thất bại"));
      }
    }
    catch (errRes: any) {
      setErrMessage(getErroMessageByCode(errRes.error.code));
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout>
      {/* Half left */}
      <img src={logo} alt='Rabbit Learning' className='form-logo'
        onClick={toWelcome} />
      <h2 className='form-title text-center'>Đăng ký tài khoản</h2>
      <p className='form-sub-title text-center'>
        Học tập thật vui cùng Rabbit Learning!
      </p>

      <form className='auth-form' onSubmit={handleSubmit}>
        {errMessage && (<ErrorMessage message={errMessage} />)}
        <Input
          icon={<User size={18} color='#999' />}
          placeholder='Tên đăng nhập'
          value={formData.username}
          onChange={e => {
            handleChange(e, () => { setErrMessage('') })
          }}
          onBlur={(e) => handleBlur(e, signUpValidation)}
          error={errors.username}
          name='username'
        />

        <Input
          icon={<Mail size={18} color='#999' />}
          placeholder='Email'
          value={formData.email}
          onChange={e => {
            handleChange(e, () => { setErrMessage('') })
          }}
          onBlur={(e) => handleBlur(e, signUpValidation)}
          error={errors.email}
          name='email'
        />

        <Input
          type='password'
          icon={<Lock size={18} color='#999' />}
          placeholder='Mật khẩu'
          value={formData.password}
          name='password'
          onBlur={(e) => handleBlur(e, signUpValidation)}
          error={errors.password}
          onChange={e => {
            handleChange(e, () => { setErrMessage('') })
          }}
        />

        <Input
          type='password'
          icon={<Lock size={18} color='#999' />}
          placeholder='Nhắc lại mật khẩu'
          value={formData.rePassword}
          name='rePassword'
          onBlur={(e) => handleBlur(e, signUpValidation)}
          error={errors.rePassword}
          onChange={e => {
            handleChange(e, () => { setErrMessage('') })
          }}
        />

        <Button text='Đăng ký' variant='primary' type='submit' isLoading={isLoading} margin='15px 0 0 0' />

        <p className='register-text'>Bạn đã có tài khoản?
          <a className='form-link' onClick={toLogin}>Đăng nhập ngay</a>
        </p>

        <div className='terms-text'>Bằng việc đăng ký, bạn đồng ý với
          <a href='#' className='form-link'>Điều khoản sử dụng</a> và
          <span> </span> <a href='#' className='form-link'>
            Chính sách bảo mật</a> của chúng tôi.
        </div>

        <div className='horizontal-line'></div>
      </form>

      <p className='copyright'>© 2025 Rabbit Learning</p>
    </AuthLayout>
  );
};

export default SignUpPage;