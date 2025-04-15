import { useNavigate } from "react-router-dom";
import UserForm from "../../components/UserForm";
import RestaurantForm from "../../components/RestaurantForm";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";

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
    <section className="container mx-auto mt-10 rounded bg-white p-5 shadow">
      {userData?.role === "usuario" ? <UserForm /> : <RestaurantForm />}
    </section>
  );
}
