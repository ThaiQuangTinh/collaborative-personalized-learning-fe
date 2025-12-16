import { Navigate, Outlet, replace } from "react-router-dom"
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";


const PrivateRoutes = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />
    }

    return <Outlet />
}

export default PrivateRoutes;