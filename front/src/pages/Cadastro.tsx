import { FormEvent, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { api } from "../connection/axios";
import { useGoogleLogin } from "@react-oauth/google";
import Button from "../componentes/Button";
import Input from "../componentes/Input";
import ModalEmail from "../componentes/ModalEmail";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const validarCampos = (): boolean => {
    const nomeTrim = nome.trim();
    const emailTrim = email.trim();

    if (nomeTrim === "" || emailTrim === "") {
      alert("Preencha todos os campos!");
      return false;
    }

    return true;
  };

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

  const handleCadastroGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await api.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );
        const {
          name: nome,
          email,
          sub: senha,
          email_verified,
        } = userInfoResponse.data;

        if (email_verified) {
          const response = await api.post("/user", {
            data: { nome, email, senha: senha.substring(0, 12) },
          });

          const userId = response.data.userInfo.id;

          localStorage.setItem("nomeUsuario", nome || "");
          localStorage.setItem("emailUsuario", email || "");
          localStorage.setItem("userId", userId);

          navigate("/account");
        } else {
          alert("Email não verificado!");
        }
      } catch (error) {
        console.error("Usuário já existe!");
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <div className="m-auto my-[3rem] flex max-w-96 flex-col space-y-4 rounded-md bg-white p-8 shadow">
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
          <div className="font-Dosis flex items-center justify-end space-x-2">
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
          <Input
            label="Informe uma senha:"
            id="senha"
            type="text"
            placeholder={"Digite sua senha"}
            value={senha}
            onChange={setSenha}
          />
        </div>

        <Button
          variant="filled"
          type="submit"
          className="!mt-5"
          disabled={!nome || !email || !senha}
        >
          Cadastrar
        </Button>
      </form>

      <div className="flex justify-end">
        <span className="text-gray-medio">Já tenho conta</span>
        <Button
          variant="plain"
          onClick={fazerLogin}
          className="!m-0 !w-[6rem] !p-0"
        >
          Fazer login
        </Button>
      </div>
      <span className="text-gray-medio mt-2 mb-6 text-center">
        -------------- OU --------------
      </span>
      <Button
        variant="filledIcon"
        color="secundary"
        img
        onClick={handleCadastroGoogle}
      >
        Fazer cadastro com o Google
      </Button>
    </div>
  );
}
