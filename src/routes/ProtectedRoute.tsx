import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  redirectTo?: string; // where to redirect if not authenticated
};

export const ProtectedRoute = ({
  redirectTo = "/signin",
}: ProtectedRouteProps) => {
  const { authenticated, loading } = useAuth();
  if (loading) {
    // Show a loader while checking auth
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    // Redirect if not authenticated
    return <Navigate to={redirectTo} replace />;
  }

  // Render child routes
  return <Outlet />;
};
