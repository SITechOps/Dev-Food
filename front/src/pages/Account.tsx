import { FormEvent, useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { api } from "../connection/axios";
import Input from "../componentes/Input";
import Button from "../componentes/Button";

export default function Account() {
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const idUsuario = localStorage.getItem("userId");
        const response = await api.get(`/user/${idUsuario}`);
        const { nome, email, senha } = response.data;
        const loginGoogle = localStorage.getItem("loginGoogle");

        setIsGoogleLogin(loginGoogle === "true");

        setNome(nome);
        setEmail(email);
        setSenha(senha);

        localStorage.setItem("nomeUsuario", nome);
        localStorage.setItem("emailUsuario", email);
        localStorage.setItem("senhaUsuario", senha);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }

    fetchUserData();
  }, []);

  async function alterarUsuario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const dados = new FormData(event.currentTarget);
    const nome = dados.get("nome")?.toString() || "";
    const senha = dados.get("senha")?.toString() || "";
    const idUsuario = localStorage.getItem("userId");

    try {
      await api.put(`/user/${idUsuario}`, { nome, senha });

      const response = await api.get(`/user/${idUsuario}`);
      setNome(response.data.nome);
      setSenha(response.data.senha);
      alert("Usuário alterado com sucesso!");

      localStorage.setItem("nomeUsuario", nome || "");
      localStorage.setItem("senhaUsuario", senha || "");
      setIsEditing(false);
    } catch (error) {
      alert("Erro ao alterar usuário. Tente novamente.");
    }
  }

  function handleEditUser() {
    setIsEditing(!isEditing);
  }

  async function deletarUsuario() {
    const idUsuario = localStorage.getItem("userId");
    try {
      await api.delete(`/user/${idUsuario}`);
      alert("Usuário removido com sucesso!");

      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar usuário. Tente novamente.");
    }
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/Login");
  }

  return (
    <section className="flex flex-col items-center justify-center !m-auto !mt-[3rem] bg-white rounded-md shadow w-[50%] !p-5">
      <a href="/home" className="self-start ml-4 mb-5">
        <FaAngleLeft className="icon" />
      </a>

      <form onSubmit={alterarUsuario} className="text-center !mt-5">
        <div id="icones-de-acao" className="flex gap-4 justify-end">
          <div
            id="Editar"
            className="w-10 h-10 flex items-center justify-center bg-[#FDEDEE] rounded-full cursor-pointer hover:bg-[#FAC8CB]"
            onClick={handleEditUser}
          >
            <FiEdit2 className="text-brown-normal text-[1.5rem]" />
          </div>
          <div
            id="deletar"
            className="w-10 h-10 flex items-center justify-center bg-[#FDEDEE] rounded-full cursor-pointer hover:bg-[#FAC8CB]"
            onClick={deletarUsuario}
          >
            <AiOutlineDelete className="text-brown-normal text-[1.5rem]" />
          </div>
        </div>


        <p className="mt-3 text-lg flex gap-2 items-center justify-center p-0">
          Nome:
          {isEditing ? (
            <Input type="text" id="nome" value={nome} onChange={setNome} />
          ) : (
            <span className="font-semibold">{nome}</span>
          )}
        </p>

        <p className="mt-3 text-lg flex gap-2 items-center justify-center p-0">
          Email:
          {isEditing ? (
            <Input
              type="text"
              id="email"
              value={email}
              onChange={setEmail}
              disabled={true}
              className="cursor-not-allowed"
            />
          ) : (
            <span className="font-semibold">{email}</span>
          )}
        </p>

        <p className="mt-3 text-lg flex gap-2 items-center justify-center p-0">
          Senha:
          {isEditing ? (
            <Input
              type="text"
              id="senha"
              value={senha}
              onChange={setSenha}
              disabled={isGoogleLogin}
            />
          ) : (
            <span className="font-semibold">{senha}</span>
          )}
        </p>


        {isEditing && (
          <Button type="submit" className="mt-[3rem]">
            Salvar
          </Button>
        )}

        <Button
          type="button"
          className="mt-5 bg-red-500 text-white px-10 py-2 rounded"
          onClick={handleLogout}
        >
          Sair
        </Button>
      </form>
    </section>
  );
}
