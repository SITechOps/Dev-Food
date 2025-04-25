import React, { createContext, useContext, useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeToken";
import { api } from "@/connection/axios";

interface AuthContextType {
  userData: { role: string | undefined; sub: string | undefined } | null;
  isAuthenticated: boolean;
  setAuth: (token: string) => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({
  userData: null,
  isAuthenticated: false,
  setAuth: () => {},
  logout: () => {},
  token: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<{
    role: string | undefined;
    sub: string | undefined;
  } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) return logout();

      try {
        const { sub, role } = decodeToken(storedToken) || {};
        if (!sub) return logout();

        const { status } = await api.get(`/user/${sub}`);
        if (status !== 200) return logout();

        setUserData({ role, sub });
        setIsAuthenticated(true);
        setToken(storedToken);
      } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        logout();
      }
    };

    checkAuth();
  }, []);

  const setAuth = (newToken: string) => {
    localStorage.setItem("token", newToken);
    const decoded = decodeToken(newToken);
    setUserData({ role: decoded?.role, sub: decoded?.sub });
    setIsAuthenticated(true);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setIsAuthenticated(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ userData, isAuthenticated, setAuth, logout, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
