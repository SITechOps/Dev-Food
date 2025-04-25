import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const RestrictRestauranteRoute = () => {
  const { userData } = useAuth();

  if (userData?.role === "restaurante") {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
};

export default RestrictRestauranteRoute;
