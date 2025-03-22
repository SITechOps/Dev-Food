import Input from "../../componentes/Input";
import { api } from "../../connection/axios";
import { useAuth } from "../../connection/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";
import { useState, FormEvent, useEffect } from "react";
import LogarGoogle from "./LogarGoogle";
import Menu from "../../componentes/Menu";
import Button from "../../componentes/Button";

export default function Login() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const { setUserLogged } = useAuth();

  useEffect(() => {
    setUserLogged(null);
  }, []);

  async function loginUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const resp = await api.get("/user");

      if (!resp?.data?.data?.attributes) {
        throw new Error("Estrutura inesperada da resposta da API.");
      }

      const respData = resp.data.data.attributes;

      if (!Array.isArray(respData) || respData.length === 0) {
        throw new Error("Nenhum usuário encontrado na resposta.");
      }

      const usuarioEncontrado = respData.find(
        (usuario: any) => usuario.email === email
      );

      if (usuarioEncontrado) {
        setUserLogged(usuarioEncontrado);
        console.log(usuarioEncontrado);
        localStorage.setItem("id_usuario", usuarioEncontrado.id);
        navigate("/account");
      } else {
        alert("E-mail não cadastrado. Por favor, faça seu cadastro.");
      }
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
      <div className="flex flex-col w-full m-auto my-[3rem] items-center justify-center mt-[3rem] pt-24">
        <h1 className="font-bold mt-4">Faça o seu login</h1>

        <div className="space-y-4 p-8 mt-[3rem] bg-white rounded-md shadow flex flex-col max-w-96 gap-2">
          <a href="/" className="self-start mb-5">
            <FaAngleLeft className="icon" />
          </a>
          <legend className="text-center font-bold mx-2">
            {" "}
            Como deseja continuar?
          </legend>

          <LogarGoogle />

          <span className="text-center text-gray-medio mb-4">
            -------------- OU --------------
          </span>

          <form onSubmit={loginUser}>
            <Input
              label="Informe o seu email:"
              id="email"
              type="email"
              value={email}
              placeholder={"fulano@exemplo.com"}
              onChange={() => setEmail}
              className="mb-2"
            />

            <Input
              label="Informe uma senha:"
              id="senha"
              type="text"
              value={senha}
              placeholder={"Digite sua senha"}
              onChange={() => setSenha}
              className="mb-6"
            />

            <Button
              onClick={() => loginUser}
              disabled={!email || !senha}
            >
              Entrar
            </Button>
          </form>

          <div className="flex justify-end mt-2">
            <span className="text-gray-medio">Não tem conta?</span>
            <Button
              color="plain"
              onClick={botaoCadastro}
              className="w-[6rem] p-0 m-0"
            >
              Cadastre-se
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
