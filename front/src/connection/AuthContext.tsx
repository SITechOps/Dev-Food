import { createContext, useContext, useState, } from "react";
import { IAuthContextType, IAuthProviderProps, IUser } from "../interface/IAuthContext";

const AuthContext = createContext<IAuthContextType | null>(null);

export function AuthProvider({ children }: IAuthProviderProps) {
  const [userLogged, setUserLogged] = useState<IUser | null>(null);

  return (
    <AuthContext.Provider value={{ userLogged, setUserLogged }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
