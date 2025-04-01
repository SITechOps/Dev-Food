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
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const idUsuario = token ? decodeToken(token)?.sub : undefined;
  const isGoogle = localStorage.getItem("isGoogle") || "";
  // const location = useLocation();

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
      setSenha(respUser.senha || "");
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  }

  async function alterarDados(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const dados = new FormData(event.currentTarget);
    const nome = dados.get("nome")?.toString() || "";
    const senha = dados.get("senha")?.toString() || "";
    try {
      await api.put(`/user/${idUsuario}`, { data: { nome, senha } });
      fetchUserData();

      alert("Usuário alterado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      alert("Erro ao alterar usuário. Tente novamente.");
    }
  }

  function handleEditUser() {
    setIsEditing(!isEditing);
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
    navigate("/Login");
  }

  if (!idUsuario) {
    return (
      <section className="flex h-screen flex-col items-center justify-center">
        <h2 className="font-bold">Acesso negado</h2>
        <p className="mt-2">
          Faça login ou cadastre-se para acessar sua conta.
        </p>
        <div className="mt-5 flex w-[40rem] gap-4">
          <Button onClick={() => navigate("/Login")}>Fazer Login</Button>
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
      <section className="m-auto mt-12 flex w-1/2 flex-col items-center justify-center rounded-md bg-white p-5 shadow">
        <div className="flex w-full items-center justify-between">
          <button onClick={() => navigate(-1)} className="self-start">
            <FaAngleLeft className="icon h-10 w-10" />
          </button>

          <h3 className="text-center font-bold">Minha Conta</h3>

          <div id="icones-de-acao" className="flex justify-end gap-4">
            <div
              id="Editar"
              className="bg--brown-light hover:bg-brown-light-active flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
              onClick={handleEditUser}
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

        <form onSubmit={alterarDados} className="mt-5">
          <div className="text-blue mt-3 flex items-center justify-start gap-2 p-0 text-lg">
            Nome:
            {isEditing ? (
              <Input type="text" id="nome" value={nome} onChange={setNome} />
            ) : (
              <span className="font-semibold">{nome}</span>
            )}
          </div>

          <p className="mt-3 flex items-center justify-start gap-2 p-0 text-lg">
            Email:
            <span className="font-semibold">{email}</span>
          </p>

          {isEditing && !isGoogle ? (
            <div className="text-blue mt-3 flex items-center justify-start gap-2 p-0 text-lg">
              Digite uma nova senha:
              <Input type="text" id="senha" value={senha} onChange={setSenha} />
            </div>
          ) : null}

          {isEditing ? (
            <Button type="submit" className="mt-12">
              Salvar
            </Button>
          ) : null}
        </form>
        <Button
          color="outlined"
          className="mt-5 w-90 p-2"
          onClick={handleLogout}
        >
          Sair
        </Button>
      </section>
    </>
  );
}
