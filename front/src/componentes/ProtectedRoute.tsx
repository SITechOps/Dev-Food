import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userId");

  if (!isAuthenticated) {
    alert("Você precisa estar logado para acessar esta página!"); // Exibe o alerta antes de redirecionar
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
