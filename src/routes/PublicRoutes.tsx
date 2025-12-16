import { Navigate, Outlet, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

const PublicRoutes = () => {
    const {user} = useAuth();

    if (user && user.verifiedEmail) {
        return <Navigate to={ROUTES.LEARNING_PATH} replace />
    }

    return <Outlet />;
    
}

export default PublicRoutes;
