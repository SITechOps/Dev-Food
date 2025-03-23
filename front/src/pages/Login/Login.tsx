import Input from "../../componentes/Input";
import { api } from "../../connection/axios";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";
import { useState, FormEvent } from "react";
import LogarGoogle from "./LogarGoogle";
import Menu from "../../componentes/Menu";
import Button from "../../componentes/Button";
import { decodeToken } from "../../utils/decodeToken";

export default function Login() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");

  async function loginUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const resp = await api.post("/login", {
        data: {
          email,
          senha,
        },
      });

      const token = resp?.data?.token;
      if (!token) {
        throw new Error("Token não encontrado na resposta da API.");
      }

      localStorage.setItem("token", token);

      const userData = decodeToken(token);
      console.log(userData);

      if (!userData?.sub) {
        throw new Error("ID do usuário não encontrado no token.");
      }
      console.log("Usuário logado:", {
        id: userData.sub,
        email,
      });

      navigate("/account");
    } catch (error: any) {
      console.error("Erro no login:", error);
      alert(error.response?.data?.message || "Erro ao fazer login.");
    }
  }

  function botaoCadastro() {
    navigate("/");
  }

  return (
    <>
      <Menu />
      <div className="m-auto flex w-full flex-col items-center justify-center pt-10">
        <h1 className="mt-4 font-bold">Faça o seu login</h1>

        <div className="card mt-[3rem] flex max-w-96 flex-col gap-2 space-y-4 shadow">
          <a href="/" className="mb-5 self-start">
            <FaAngleLeft className="icon" />
          </a>
          <legend className="mx-2 text-center font-bold">
            Como deseja continuar?
          </legend>

          <LogarGoogle />

          <span className="text-gray-medio mb-4 text-center">
            -------------- OU --------------
          </span>

          <form onSubmit={loginUser}>
            <Input
              label="Informe o seu email:"
              id="email"
              type="email"
              value={email}
              placeholder={"fulano@exemplo.com"}
              onChange={setEmail}
              className="mb-2"
            />

            <Input
              label="Informe uma senha:"
              id="senha"
              type="text"
              value={senha}
              placeholder={"Digite sua senha"}
              onChange={setSenha}
              className="mb-6"
            />

            <Button onClick={() => loginUser} disabled={!email || !senha}>
              Entrar
            </Button>
          </form>

          <div className="mt-2 flex justify-end">
            <span className="text-gray-medio">Não tem conta?</span>
            <Button
              color="plain"
              onClick={botaoCadastro}
              className="m-0 w-[6rem] p-0"
            >
              Cadastre-se
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
