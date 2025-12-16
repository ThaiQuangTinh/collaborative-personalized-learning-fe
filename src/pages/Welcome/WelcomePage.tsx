import React, { useEffect, useState } from 'react';

import '../../styles/_variables.css';
import './WelcomePage.css';

import Button from '../../components/Button/Button';

import logo from '../../assets/images/logo.png';
import welcomeImage from '../../assets/images/welcome.png';

import Footer from '../../components/Footer/Footer';
import useRouteNavigation from '../../hooks/useNavigation';

const WelcomePage: React.FC = () => {

  const { toLogin, toSignUp } = useRouteNavigation();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="welcome-page">
      <div className={`welcome-logo ${isScrolled ? 'scrolled' : ''}`}>
        <img src={logo} alt="Rabbit Learning" className="logo-image" />
        <h3>Rabbit Learning</h3>
      </div>

      <div className="welcome-content">
        <div className="welcome-left">
          <img src={welcomeImage} alt="Rabbit Learning" className="welcome-image" />
        </div>

        <div className="welcome-right">
          <div className='welcome-title'>
            <h2>Khám phá lộ trình học riêng</h2>
            <h2>Lưu giữ tri thức, cùng nhau tiến bộ</h2>
          </div>

          <div className="welcome-buttons">
            <Button text="Đăng nhập" variant="primary" onClick={toLogin} />
            <Button text="Đăng ký" variant="secondary" onClick={toSignUp} margin='15px 0 0 0' />
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default WelcomePage;
