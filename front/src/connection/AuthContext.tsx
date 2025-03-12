import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  nome: string;
  email: string;
  id: number;
  is_admin: boolean;
}

interface AuthContextType {
  userLogged: User | null;
  setUserLogged: (user: User | null) => void;
}

interface AuthProviderProps {
  children: ReactNode; // Define corretamente o tipo de children
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [userLogged, setUserLogged] = useState<User | null>(null);

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
