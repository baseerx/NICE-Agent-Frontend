import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type PublicRouteProps = {
    // Where to redirect IF the user IS authenticated (e.g. dashboard)
    redirectTo?: string;
};

export const PublicRoute = ({ redirectTo = "/dashboard" }: PublicRouteProps) => {
    const { authenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <div
                style={{
                width: 40,
                height: 40,
                border: "4px solid rgba(0,0,0,0.1)",
                borderTop: "4px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // If user is authenticated, prevent landing on public pages (signin/signup)
    if (authenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    // Otherwise allow access to public routes
    return <Outlet />;
};
