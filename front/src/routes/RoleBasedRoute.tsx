import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";

type UserRole = "usuario" | "restaurante";
type AllowedRole = UserRole | "any";

interface RoleBasedRouteProps {
  allowedRoles: AllowedRole[];
}

export default function RoleBasedRoute({ allowedRoles }: RoleBasedRouteProps) {
  const { isAuthenticated, userData } = useAuth();
  const location = useLocation();
  if (!isAuthenticated && !allowedRoles.includes("any")) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const userRole = userData?.role as UserRole | undefined;

  if (
    allowedRoles.includes("any") ||
    (userRole && allowedRoles.includes(userRole))
  ) {
    return <Outlet />;
  }

  return <Navigate to="/account" replace />;
}
