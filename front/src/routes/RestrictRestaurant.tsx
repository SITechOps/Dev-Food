import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function RestrictRestauranteOnly() {
  const { isAuthenticated, userData } = useAuth();
  const location = useLocation();
  const userRole = userData?.role;

  if (isAuthenticated && userRole === "restaurante") {
    return <Navigate to="/account" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
