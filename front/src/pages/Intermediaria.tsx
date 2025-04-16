import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

export default function Intermediaria() {
  const navigate = useNavigate();
  const styleH1 = "font-bold break-words w-64";
  const styleDescricao = "pt-5 break-words w-55";

  return (
    <div className="flex h-screen items-center justify-center gap-40">
      <div className="flex items-center gap-5">
        <img
          src="../img/matar_fome.svg"
          alt="Matar Fome"
          className="mr-5 h-40 w-40"
        />
        <div>
          <h1 className={styleH1}>Quer pedir comida no Ifood?</h1>
          <p className={styleDescricao}>
            Faça login ou crie sua conta como cliente para começar a pedir no
            Ifood.
          </p>

          <Button onClick={() => navigate("/auth")} className="mt-4 w-48">
            Entrar como cliente
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <img
          src="../img/restaurante.svg"
          alt="Restaurante"
          className="mr-5 h-40 w-40"
        />
        <div>
          <h1 className={styleH1}>Quer vender no Ifood?</h1>
          <p className={styleDescricao}>
            Cadastre seu restaurante ou acesse sua conta se já for um de nossos
            parceiros.
          </p>

          <Button
            onClick={() => navigate("/cadastro-restaurante")}
            className="mt-4 w-48 p-3.5"
          >
            Cadastrar restaurante
          </Button>

          <Button onClick={() => navigate("/auth")} className="mt-4 w-48 p-3.5">
            Já sou parceiro
          </Button>
        </div>
      </div>
    </div>
  );
}
