import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Intermediaria() {
  const navigate = useNavigate();
  const styleH1 = "font-bold break-words w-64";
  const styleDescricao = "pt-5 break-words w-55";

  const handleClick = () => {
    navigate("/auth");
  };
  const formRestauranteClick = () => {
    navigate("/cadastro-restaurante");
  };

  return (
    <div className="flex h-screen items-center justify-center gap-40">
      <div className="flex items-center gap-5">
        <img
          src="../img/matar_fome.svg"
          alt="Matar Fome"
          className="h-40 w-40 mr-5"
        />
        <div>
          <h1 className={styleH1}>Quero matar minha fome</h1>
          <p className={styleDescricao}>
            Faça agora o seu cadastro e comece o quanto antes.
          </p>

          <Button onClick={handleClick} className="mt-4 w-48">
            Cadastrar
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <img
          src="../img/restaurante.svg"
          alt="Restaurante"
          className="h-40 w-40 mr-5"   
        />
        <div>
          <h1 className={styleH1}>
            Quer seu restaurante no iFood?
          </h1>
          <p className={styleDescricao}>Cadastre seu restaurante ou o seu mercado</p>

          <Button onClick={formRestauranteClick} className="mt-4 w-48">
            Cadastrar
          </Button>
        </div>
      </div>
    </div>
  );
}
