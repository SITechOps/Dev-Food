import { useNavigate } from "react-router-dom";
import UserForm from "../../(Usuario)/pages/UserForm";
import RestaurantForm from "../../(Restaurante)/pages/RestaurantForm";
import Button from "../../../shared/components/ui/Button";
import { useAuth } from "../../../contexts/AuthContext";

export default function Account() {
  const { userData, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <section className="flex h-screen flex-col items-center justify-center">
        <h2 className="font-bold">Acesso negado</h2>
        <p className="mt-2">Faça login para acessar sua conta!</p>
        <Button
          onClick={() => {
            navigate("/auth");
          }}
          className="mt-5 w-100"
        >
          Fazer Login
        </Button>
      </section>
    );
  }

  return (
    <section className="flex w-full justify-center">
      {userData?.role === "usuario" ? (
        <div className="mt-10 flex w-full justify-center">
          <UserForm />
        </div>
      ) : (
        <RestaurantForm />
      )}
    </section>
  );
}
