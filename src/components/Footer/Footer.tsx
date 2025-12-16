import { useNavigate } from "react-router-dom";

import './Footer.css';

const Footer = () => {

    const navigate = useNavigate();

    const handleNavToLogin = () => navigate('/login');

    const handleNavToSignUp = () => navigate('/sign-up');

    return (
        <footer className="welcome-footer">
            <div className="footer-columns">
                <div>
                    <h4>Thông tin</h4>
                    {/* <img src={logo} alt="" /> */}
                    <span>Rabbit Learning - Nền tảng học tập tương tác, cá nhân hóa lộ trình và thúc đẩy cộng tác</span>
                </div>

                <div>
                    <h4>Hỗ trợ</h4>
                    <p>Hướng dẫn sử dụng</p>
                    <p>Điều khoản</p>
                    <p>Chính sách bảo mật</p>
                </div>

                <div>
                    <h4>Điều hướng nhanh</h4>
                    <p onClick={handleNavToLogin}>Đăng nhập</p>
                    <p onClick={handleNavToSignUp}>Đăng ký</p>
                </div>

                <div>
                    <h4>Kết nối</h4>
                    <p>Facebook</p>
                    <p>Instagram</p>
                </div>
            </div>

            <p className="footer-copy">© 2025 Rabbit Learning</p>
        </footer>
    );
}

export default Footer;