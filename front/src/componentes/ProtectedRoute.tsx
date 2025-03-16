import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userId"); // Verifique o login do usuário, por exemplo, através do localStorage

  useEffect(() => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para acessar esta página!");  // Alerta 
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redireciona para a página de login caso não esteja autenticado
  }

  return <>{children}</>; // Caso esteja autenticado, renderiza o componente filho
};

export default ProtectedRoute;
