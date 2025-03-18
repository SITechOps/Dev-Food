import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import iFoodLogo from "../assets/ifood.png";
import Button from "./Button";

export default function Menu() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação

  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <header className="bg-gray-claro shadow-md fixed w-full h-25 px-20 top-0 left-0 right-0 z-50 mx-0">
      <div className="flex justify-between items-center p-5 mx-10">
        <Link to="/">
          <img src={iFoodLogo} alt="iFood Logo" className="h-15" />
        </Link>

        <div className="flex gap-14">
          <Button
            variant="plain"
            onClick={() => navigate("/pedido")}
            className="!w-40 !py-2"
          >
            Faça seu pedido
          </Button>
          {isAuthenticated ? (
            <Button
              variant="filled"
              color="secundary"
              onClick={handleLogout}
              className="!w-25 !py-2"
            >
              Sair
            </Button>
          ) : (
            <Button
              variant="filled"
              color="secundary"
              onClick={() => navigate("/login")}
              className="!w-25 !py-2"
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
