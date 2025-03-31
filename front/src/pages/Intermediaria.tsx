import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Intermediaria() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/cadastro");
  };

  return (
    <div className="flex h-screen items-center justify-center gap-20">
      <div className="flex items-center gap-5">
        <img
          src="../img/matar_fome.svg"
          alt="Matar Fome"
          className="h-40 w-40"
        />
        <div>
          <h1>Quero matar minha fome</h1>
          <p>Faça agora o seu cadastro e comece o quanto antes.</p>

          <Button onClick={handleClick} className="mt-4 w-48">
            Cadastrar
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <img
          src="../img/restaurante.svg"
          alt="Restaurante"
          className="h-40 w-40"
        />
        <div>
          <h1>Quer seu restaurante no iFood?</h1>
          <p>Cadastre seu restaurante ou o seu mercado</p>

          <Button className="mt-4 w-48">Cadastrar</Button>
        </div>
      </div>
    </div>
  );
}
