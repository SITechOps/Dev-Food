import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/decodeToken";
import RestaurantForm from "../components/Restaurante/RestaurantAccount";
import Button from "../components/ui/Button";
import UserForm from "../components/Usuario/UserAccount";

export default function Account() {
  const token = localStorage.getItem("token");
  const role = token ? decodeToken(token)?.role : undefined;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  });

  if (!isAuthenticated)
    return (
      <section className="flex h-screen flex-col items-center justify-center">
        <h2 className="font-bold">Acesso negado</h2>
        <p className="mt-2">Faça login para acessar sua conta!</p>
        <Button onClick={() => navigate("/auth")} className="mt-5 w-100">
          Fazer Login
        </Button>
      </section>
    );

  return (
    <section className="container mx-auto mt-12">
      {role === "usuario" ? <UserForm /> : <RestaurantForm />}
    </section>
  );
}
