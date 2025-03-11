import { FormEvent, useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { PiUserFocusThin } from "react-icons/pi";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import Input from "../../componentes/Input";
import Button from "../../componentes/Button";
import { api } from "../../connection/axios";

export default function Account() {
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

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
    const nome = dados.get("nome");
    const email = dados.get("email");
    const senha = dados.get("senha");

    try {
      await api.put(`/user/${email}`, { nome, senha });
      alert("Usuário alterado com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar usuário:", error);
      alert("Erro ao alterar usuário. Tente novamente.");
    }
  }

  function handleEditUser() {
    setIsEditing(!isEditing);
  }

  const handleSave = () => {
    // Aqui você pode salvar as alterações no localStorage ou fazer outra lógica
    // localStorage.setItem("nomeUsuario", nomeEdit);
    // localStorage.setItem("nomeEmail", emailEdit);
    setIsEditing(false); // Desativa o modo de edição
  };

  return (
    <section className="flex flex-col items-center justify-center !m-auto !mt-[3rem] bg-white rounded-md shadow w-[50%] !p-5">
      <a href="/home" className="self-start ml-4 mb-5">
        <FaAngleLeft className="icon" />
      </a>

      <div className="w-[10rem] h-[10rem] bg-gray-claro rounded-full flex flex-col items-center justify-center ">
        <PiUserFocusThin className="text-[8rem] text-gray-medio" />
      </div>

      <form onSubmit={alterarUsuario} className="text-center !mt-5">
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
          />
        </div>

        <p className="!mt-3 text-lg flex gap-2 items-center justify-center p-0">
          Nome:
          {isEditing ? (
            <Input type="text" id="nome" value={nome} onChange={setNome} />
          ) : (
            <span className="!font-semibold">{nome}</span>
          )}
        </p>

        <p className="!mt-3 text-lg flex gap-2 items-center justify-center p-0">
          Email:
          {isEditing ? (
            <Input type="text" id="email" value={email} onChange={setEmail} />
          ) : (
            <span className="!font-semibold">{email}</span>
          )}
        </p>

        <p className="!mt-3 text-lg flex gap-2 items-center justify-center p-0">
          Senha:
          {isEditing ? (
            <Input type="text" id="senha" value={senha} onChange={setSenha} />
          ) : (
            <span className="!font-semibold">{senha}</span>
          )}
        </p>

        {/* <p className="!pt-4 text-lg">
          Endereço:{" "}
          <span className="!font-semibold">
            Rua Da Saúde nº12 - 06352-663 - SP
          </span>
        </p> */}

        {/* Botão para salvar alterações */}
        {isEditing && (
          <Button type="submit" className="mt-[3rem]">
            {" "}
            Salvar{" "}
          </Button>
        )}
      </form>
    </section>
  );
}
