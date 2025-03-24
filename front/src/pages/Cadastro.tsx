import { FormEvent, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { api } from "../connection/axios";
import Input from "../componentes/Input";
import ModalEmail from "../componentes/ModalEmail";
import Button from "../componentes/Button";
import LogarGoogle from "./LogarGoogle";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  function fazerLogin(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    navigate("/login");
  }

  async function enviarEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsModalOpen(true);

    try {
      const response = await api.post("/send-email", {
        data: { email },
      });
      setCodigoEnviado(response.data.properties.verificationCode);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
    }
  }

  return (
    <div className="card m-auto my-[3rem] flex max-w-96 flex-col space-y-4">
      {isModalOpen && (
        <ModalEmail
          nome={nome}
          email={email}
          senha={senha}
          codigoEnviado={codigoEnviado}
        />
      )}
      <form onSubmit={enviarEmail}>
        <button onClick={() => navigate(-1)} className="mb-5 self-start">
          <FaAngleLeft className="icon" />
        </button>
        <legend className="mb-4 text-center font-bold">Cadastra-se</legend>

        <div className="w-full space-y-4">
          <Input
            label="Informe o seu nome:"
            id="nome"
            type="text"
            value={nome}
            placeholder={"Fulando de tal"}
            onChange={setNome}
          />
          <div className="flex items-center justify-end space-x-2">
            <Input
              label="Informe o seu email:"
              id="email"
              type="email"
              value={email}
              placeholder={"fulando@exemplo.com"}
              onChange={setEmail}
              className="flex-grow"
            />
          </div>

          <div className="relative flex items-center z-10">
            <Input
              label="Informe uma senha:"
              id="senha"
              type={mostrarSenha ? "text" : "password"}
              placeholder={"Digite sua senha"}
              value={senha}
              onChange={setSenha}
            />
            <button
              type="button"
              className="absolute right-3 icon pt-7"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? <AiFillEyeInvisible/> : <AiFillEye />}
            </button>
          </div>

        </div>

        <Button
          type="submit"
          className="mt-5"
          disabled={!nome || !email || !senha}
        >
          Cadastrar
        </Button>
      </form>

      <div className="flex justify-end">
        <span className="text-gray-medio">Já tenho conta</span>
        <Button
          color="plain"
          onClick={fazerLogin}
          className="m-0 w-[6rem] p-0">Fazer login</Button>
      </div>
      <span className="text-gray-medio mt-2 mb-6 text-center">
        -------------- OU --------------
      </span>
      <LogarGoogle />
    </div>
  );
}
