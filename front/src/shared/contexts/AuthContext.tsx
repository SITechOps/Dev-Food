import React, { createContext, useContext, useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeToken";
import { api } from "@/lib/axios";

interface UserData {
  role: string;
  sub: string;
}

interface AuthContextType {
  userData: { role: string | undefined; sub: string | undefined } | null;
  isAuthenticated: boolean;
  loading: boolean; // <- novo
  setAuth: (token: string) => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        logout();
        setLoading(false);
        return;
      }

      try {
        const decoded = decodeToken(storedToken);

        if (!decoded?.sub || !decoded?.role) {
          console.error("Token inválido ou sem informações necessárias.");
          logout();
          setLoading(false);
          return;
        }

        const { status } = await api.get(`/user/${decoded.sub}`);
        if (status !== 200) {
          console.error("Usuário não encontrado ou erro de autenticação.");
          logout();
          setLoading(false);
          return;
        }

        setUserData({ role: decoded.role, sub: decoded.sub });
        setIsAuthenticated(true);
        setToken(storedToken);
      } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const setAuth = (newToken: string) => {
    localStorage.setItem("token", newToken);
    const decoded = decodeToken(newToken);

    if (decoded?.sub && decoded?.role) {
      setUserData({ role: decoded.role, sub: decoded.sub });
      setIsAuthenticated(true);
      setToken(newToken);
    } else {
      console.error("Token inválido ao tentar autenticar.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setIsAuthenticated(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ userData, isAuthenticated, setAuth, logout, token, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
