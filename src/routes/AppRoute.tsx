import { BrowserRouter, Route, Routes } from "react-router-dom";

import PublicRoutes from "./PublicRoutes";

import ChangePasswordPage from "../pages/ChangePassword/ChangePasswordPage";
import ForgotPasswordPage from "../pages/ForgotPassword/ForgotPasswordPage";
import LoginPage from "../pages/Login/LoginPage";
import SignUpPage from "../pages/SignUp/SignUpPage";
import VerificationCodePage from "../pages/VerificationCode/VerificationCodePage";
import WelcomePage from "../pages/Welcome/WelcomePage";
import PrivateRoutes from "./PrivateRoutes";

import { ROUTES } from '../constants/routes';
import MainLayout from "../layouts/MainLayout/MainLayout";
import DashBoardPage from "../pages/DashBoard/DashBoardPage";
import LearningFeedPage from "../pages/LearningFeed/LearningFeedPage";
import LearningPathPage from "../pages/LearningPath/LearningPathPage";
import LearningPathDetail from "../pages/LearningPathDetail/LearningPathDetail";
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SettingPage from "../pages/UserSetting/UserSettingPage";
import TestPage from "../pages/Test/TestPage";
import LearningProgressPage from "../pages/Learning Statistics/LearningStatisticsPage";
import NotificationPage from "../pages/Notification/NotificationPage";
import UserManagement from "../pages/UserManagement/UserManagement";
import PostManagement from "../pages/PostManagement/PostManagement";

const AppRoute = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicRoutes />}>
                    <Route path={ROUTES.WELCOME} element={<WelcomePage />} />
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
                    <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
                    <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePasswordPage />} />
                    <Route path={ROUTES.VERIFY_EMAIL} element={<VerificationCodePage />} />
                    <Route path={ROUTES.VERIFY_EMAIL_FORGOT} element={<VerificationCodePage flow='forgot' />} />
                    <Route path={ROUTES.VERIFY_EMAIL_PROFILE} element={<VerificationCodePage flow='profile' />} />
                    <Route path={ROUTES.TEST} element={<TestPage />} />
                </Route>

                <Route element={<PrivateRoutes />}>
                    <Route element={<MainLayout />} >
                        <Route element={<LearningPathPage />} />
                        <Route path={ROUTES.DASHBOARD} element={<DashBoardPage />} />
                        <Route path={ROUTES.LEARNING_PATH} element={<LearningPathPage />} />
                        <Route path={ROUTES.LEARNING_FEED} element={<LearningFeedPage />} />
                        <Route path={ROUTES.LEARNING_PROGRESS} element={<LearningProgressPage />} />
                        <Route path={ROUTES.NOTIFATION} element={<NotificationPage />} />
                        <Route path={ROUTES.SETTING} element={<SettingPage />} />
                        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                        <Route path={`${ROUTES.LEARNING_PATH}/:pathId/*`} element={<LearningPathDetail />} />

                        <Route path={ROUTES.USER_MANAGEMENT} element={<UserManagement />} />
                        <Route path={ROUTES.POST_MANAGEMENT} element={<PostManagement />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoute;