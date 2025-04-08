import { FormEvent, useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { api } from "../connection/axios";
import Input from "../components/Input";
import Button from "../components/Button";
import Menu from "../components/Menu";
import ListagemEndereco from "../components/ListagemEndereco";
import { decodeToken } from "../utils/decodeToken";

export default function Account() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const token = localStorage.getItem("token");
  const [isEditing, setIsEditing] = useState(false);
  const idUsuario = token ? decodeToken(token)?.sub : undefined;
  const isGoogle = localStorage.getItem("isGoogle") || "";

  useEffect(() => {
    if (!idUsuario) return;
    fetchUserData();
  }, [idUsuario]);

  async function fetchUserData() {
    try {
      const response = await api.get(`/user/${idUsuario}`);
      const respUser = response.data?.data?.attributes || [];
      setNome(respUser.nome || "");
      setEmail(respUser.email || "");
      setTelefone(respUser.telefone || "");
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  }

  async function alterarDados(event: FormEvent<HTMLFormElement>) {
    console.log(event)
    event.preventDefault();
    const dados = new FormData(event.currentTarget);
    console.log("dados", dados)
    const nome = dados.get("nome")?.toString();
    const telefone = dados.get("telefone")?.toString();
    console.log(telefone)
    console.log(nome)
    try {
      await api.put(`/user/${idUsuario}`, { data: { nome, telefone, email } });
      alert("Usuário alterado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      alert("Erro ao alterar usuário. Tente novamente.");
    }
    fetchUserData();
  }

  async function deletarDados() {
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
    navigate("/Auth");
  }

  if (!idUsuario) {
    return (
      <section className="flex h-screen flex-col items-center justify-center">
        <h2 className="font-bold">Acesso negado</h2>
        <p className="mt-2">
          Faça login ou cadastre-se para acessar sua conta.
        </p>
        <div className="mt-5 flex w-[40rem] gap-4">
          <Button onClick={() => navigate("/Auth")}>Fazer Login</Button>
          <Button color="secondary" onClick={() => navigate("/")}>
            Cadastrar-se
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <Menu>
        <ListagemEndereco />
      </Menu>
      <section className="m-auto mt-12 flex w-1/2 flex-col justify-center rounded-md bg-white p-5 shadow">
        <div className="flex w-full items-center justify-between">
          <button onClick={() => navigate("/")} className="self-start">
            <FaAngleLeft className="icon h-10 w-10" />
          </button>

          <div id="icones-de-acao" className="flex justify-end gap-4">
            <div
              id="Editar"
              className="bg--brown-light hover:bg-brown-light-active flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
              onClick={() => setIsEditing(!isEditing)}
            >
              <FiEdit2 className="icon" />
            </div>
            <div
              id="deletar"
              className="bg-brown-light hover:bg-brown-light-active flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
              onClick={deletarDados}
            >
              <AiOutlineDelete className="icon" />
            </div>
          </div>
        </div>

        <h3 className="text-center font-bold">Minha Conta</h3>

        <form onSubmit={alterarDados} className="mt-5 ml-4">
          <div className="text-blue mt-3 flex items-center justify-start gap-2 p-0 text-lg">
            Nome:
            {isEditing ? (
              <Input type="text" id="nome" name="nome" value={nome} onChange={setNome} />
            ) : (
              <span className="font-semibold">{nome}</span>
            )}
          </div>

          {!isGoogle ? (
            <div className="text-blue mt-3 flex items-center justify-start gap-2 p-0 text-lg">
              Telefone:
              {isEditing ? (
                <Input type="text" id="senha" name="telefone" value={telefone} onChange={setTelefone} />
              ) : (
                <span className="font-semibold">{telefone}</span>
              )}
            </div>
          ) : null}

          <p className="mt-3 flex items-center justify-start gap-2 p-0 text-lg">
            Email:
            <span className="font-semibold">{email}</span>
          </p>

          {isEditing ? (
            <Button type="submit" className="mt-5">
              Salvar
            </Button>
          ) : null}
        </form>
        <hr className="my-4 text-gray-light border-2 rounded-xl" />

        <div className="text-right">
          <Button
            color="outlined"
            className="mt-3 w-55 p-2"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      </section>
    </>
  );
}
