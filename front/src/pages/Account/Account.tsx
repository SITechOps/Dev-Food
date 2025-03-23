import { FormEvent, useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { PiUserFocusThin } from "react-icons/pi";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import Input from "../../componentes/Input";
import { api } from "../../connection/axios";
import { useNavigate } from "react-router-dom";
import Button from "../../componentes/Button";

export default function Account() {
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const nomeUsuario = localStorage.getItem("nomeUsuario") || "";
    const emailUsuario = localStorage.getItem("emailUsuario") || "";
    const senhaUsuario = localStorage.getItem("senhaUsuario") || "";
    setNome(nomeUsuario);
    setEmail(emailUsuario);
    setSenha(senhaUsuario);
  }, []);

  async function alterarUsuario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const dados = new FormData(event.currentTarget);
    const nome = dados.get("nome")?.toString();
    const senha = dados.get("senha")?.toString();
    const idUsuario = localStorage.getItem("userId");

    try {
      await api.put(`/user/${idUsuario}`, { data: { nome, senha } });
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

  return (
    <section className="m-auto flex w-[50%] flex-col items-center justify-center rounded-md bg-white p-5 shadow">
      <a href="/home" className="mb-5 ml-4 self-start">
        <FaAngleLeft className="icon" />
      </a>

      <div className="bg-gray-claro flex h-[10rem] w-[10rem] flex-col items-center justify-center rounded-full">
        <PiUserFocusThin className="text-gray-medio text-[8rem]" />
      </div>

      <form onSubmit={alterarUsuario} className="mt-5 text-center">
        <div id="icones-de-acao" className="flex justify-end gap-4">
          <FiEdit2
            id="Editar"
            className="icon cursor-pointer"
            onClick={handleEditUser}
          />
          <AiOutlineDelete
            id="deletar"
            type="submit"
            className="icon cursor-pointer"
            onClick={deletarUsuario}
          />
        </div>

        <p className="mt-3 flex items-center justify-center gap-2 p-0 text-lg">
          Nome:
          {isEditing ? (
            <Input type="text" id="nome" value={nome} onChange={setNome} />
          ) : (
            <span className="font-semibold">{nome}</span>
          )}
        </p>

        <p className="mt-3 flex items-center justify-center gap-2 p-0 text-lg">
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

        <p className="mt-3 flex items-center justify-center gap-2 p-0 text-lg">
          Senha:
          {isEditing ? (
            <Input type="text" id="senha" value={senha} onChange={setSenha} />
          ) : (
            <span className="font-semibold">{senha}</span>
          )}
        </p>

        {isEditing && (
          <Button type="submit" className="mt-[3rem]">
            Salvar
          </Button>
        )}
      </form>
    </section>
  );
}
