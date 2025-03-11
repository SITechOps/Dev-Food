import { data, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import Button from "../componentes/Button";
import Input from "../componentes/Input";
import { api } from "../connection/axios";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
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
    console.log("login realizado");
  }

  async function cadastrarUsuario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const dados = new FormData(event.currentTarget);
    const nome = dados.get("nome")?.toString();
    const email = dados.get("email")?.toString();
    const senha = dados.get("senha")?.toString();

    try {
      const response = await api.post("/user", {
        data: { nome, email, senha },
      });

      const userId = response.data.userInfo.id;

      localStorage.setItem("nomeUsuario", nome || "");
      localStorage.setItem("emailUsuario", email || "");
      localStorage.setItem("senhaUsuario", senha || "");
      localStorage.setItem("userId", userId);

      if (validarCampos()) {
        navigate("/account");
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  }

  const handleCadastroGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      api.post("/auth/google", {
        data: {
          token: tokenResponse.access_token,
        },
      });
      console.log(tokenResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const verificarEmail = () => {
    console.log("Verificando email:", email);
    // Adicione aqui a lógica para verificar o email
  };

  return (
    <div className="space-y-4 !p-8 !mt-[3rem] bg-white rounded-md shadow flex flex-col max-w-96 m-auto">
      <form onSubmit={cadastrarUsuario}>
        <legend className="text-center mb-4 text-2xl">
          Como deseja continuar?
        </legend>
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
          <Input
            label="Informe uma senha:"
            id="senha"
            type="text"
            placeholder={"Digite sua senha"}
            value={senha}
            onChange={setSenha}
          />
        </div>

        <div className="flex justify-end">
          <span className="text-gray-medio">Já tenho conta</span>
          <Button
            variant="plain"
            onClick={fazerLogin}
            className="!w-[6rem] !p-0 !m-0"
          >
            Fazer login
          </Button>
        </div>

        <Button variant="filled" type="submit" className="!mt-5">
          Continuar
        </Button>
      </form>
      <span className="text-center text-gray-medio mt-4 mb-6">
        -------------- OU --------------
      </span>
      <Button
        variant="filledIcon"
        color="secundary"
        img
        onClick={handleCadastroGoogle}
        className="items-center justify-center flex gap-4 cursor-pointer"
      >
        Fazer cadastro com o Google
      </Button>
    </div>
  );
}
