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
      setIsEditing(false)
      
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
    <section className="flex flex-col items-center justify-center m-auto bg-white rounded-md shadow w-[50%] p-5">
      <a href="/home" className="self-start ml-4 mb-5">
        <FaAngleLeft className="icon" />
      </a>

      <div className="w-[10rem] h-[10rem] bg-gray-claro rounded-full flex flex-col items-center justify-center ">
        <PiUserFocusThin className="text-[8rem] text-gray-medio" />
      </div>

      <form onSubmit={alterarUsuario} className="text-center mt-5">
        <div id="icones-de-acao" className="flex gap-4 justify-end">
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
