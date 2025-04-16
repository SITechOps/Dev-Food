import React, { createContext, useContext, useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeToken";

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
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      setUserData({ role: decoded?.role, sub: decoded?.sub });
      setIsAuthenticated(true);
      setToken(storedToken);
    }
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
