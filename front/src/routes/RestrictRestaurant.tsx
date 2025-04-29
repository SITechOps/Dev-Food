import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function RestrictRestauranteOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, userData } = useAuth();
  const userRole = userData?.role;

  if (isAuthenticated && userRole === "restaurante") {
    return <Navigate to="/account" replace />;
  }

  return children;
}
