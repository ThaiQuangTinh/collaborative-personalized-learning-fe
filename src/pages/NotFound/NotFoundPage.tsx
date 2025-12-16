import { useLocation, useNavigate } from 'react-router-dom';
import pageNotFoundImg from '../../assets/images/page_not_found.png';
import Button from "../../components/Button/Button";
import useRouteNavigation from '../../hooks/useNavigation';
import './NotFoundPage.css';


const NotFoundPage = () => {

    const { toHome } = useRouteNavigation();

    const navigate = useNavigate();
    const location = useLocation();

    const handleRetry = () => {
        // navigate(location.pathname, { replace: true });
        window.location.reload();
    };

    return (
        <div className="not-found-page">
            <form action="" className='not-found-form' >
                <img src={pageNotFoundImg} alt="Quên mật khẩu" id="pageNotFoundImg" className="fp-image" />
                <h2 className="form-title text-center">Oops! Không tìm thấy trang này</h2>
                <p className="form-sub-title text-center">Có vẻ như bạn đã nhập sai đường dẫn hoặc trang này không có sẵn</p>

                <Button text="Quay lại trang chủ" variant="primary" onClick={toHome} />
                <a className="form-link" onClick={handleRetry}>Thử lại</a>

                <div className="horizontal-line"></div>
                <p className="copyright">© 2025 Rabbit Learning</p>
            </form>
        </div>
    );
}

export default NotFoundPage;