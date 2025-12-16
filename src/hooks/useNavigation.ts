import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

interface RouteNavigation {
    toWelcome: () => void;
    toLogin: () => void;
    toSignUp: () => void;
    toForgotPassword: () => void;
    toVerifyEmailForgot: () => void;
    toVerifyEmailProfile: () => void;
    toChangePassword: () => void;
    toVerifyEmail: () => void;
    toHome: () => void;
    toDashboard: () => void;
    toProfile: () => void;
    toLearningPath: () => void;
    toLearningPathDetails: (pathId: string, edit?: boolean) => void;
    toNotification: () => void;
    toUserManagement: () => void;
    toPostManagement: () => void;
}

const useRouteNavigation = (): RouteNavigation => {
    const navigate = useNavigate();

    const toWelcome = () => navigate(ROUTES.WELCOME);
    const toLogin = () => navigate(ROUTES.LOGIN);
    const toSignUp = () => navigate(ROUTES.SIGN_UP);
    const toForgotPassword = () => navigate(ROUTES.FORGOT_PASSWORD);
    const toVerifyEmailForgot = () => navigate(ROUTES.VERIFY_EMAIL_FORGOT);
    const toVerifyEmailProfile = () => navigate(ROUTES.VERIFY_EMAIL_PROFILE);
    const toChangePassword = () => navigate(ROUTES.CHANGE_PASSWORD);
    const toVerifyEmail = () => navigate(ROUTES.VERIFY_EMAIL);

    const toHome = () => navigate(ROUTES.HOME);
    const toDashboard = () => navigate(ROUTES.DASHBOARD);
    const toProfile = () => navigate(ROUTES.PROFILE);
    const toLearningPath = () => navigate(ROUTES.LEARNING_PATH);
    const toLearningPathDetails = (pathId: string, edit = false) => {
        navigate({
            pathname: ROUTES.LEARNING_PATH_DETAILS(pathId),
            search: edit ? "?edit=true" : ""
        });
    };
    const toNotification = () => navigate(ROUTES.NOTIFATION);

    const toUserManagement = () => navigate(ROUTES.USER_MANAGEMENT);
    const toPostManagement = () => navigate(ROUTES.POST_MANAGEMENT);

    return {
        toWelcome,
        toLogin,
        toSignUp,
        toForgotPassword,
        toVerifyEmailForgot,
        toVerifyEmailProfile,
        toChangePassword,
        toVerifyEmail,
        toHome,
        toDashboard,
        toProfile,
        toLearningPath,
        toLearningPathDetails,
        toNotification,
        toUserManagement,
        toPostManagement
    }
};

export default useRouteNavigation;