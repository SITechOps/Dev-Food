import { useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { PiUserFocusThin } from "react-icons/pi";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import Input from "../../componentes/Input";
import Button from "../../componentes/Button";

export default function Account() {
  // Defina um valor padrão para os campos
  const nome = localStorage.getItem("nomeUsuario") || "";  // Valor padrão vazio se for null
  const email = localStorage.getItem("nomeEmail") || "";  // Valor padrão vazio se for null

  // Crie estados para controlar os campos editáveis
  const [isEditing, setIsEditing] = useState(false);
  const [nomeEdit, setNomeEdit] = useState(nome);
  const [emailEdit, setEmailEdit] = useState(email);

  const handleEditClick = () => {
    setIsEditing(true); // Ativa o modo de edição
  };

  const handleSave = () => {
    // Aqui você pode salvar as alterações no localStorage ou fazer outra lógica
    localStorage.setItem("nomeUsuario", nomeEdit);
    localStorage.setItem("nomeEmail", emailEdit);
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

      <div className="text-center !mt-5">
        <div id="icones-de-acao" className="flex gap-4 justify-end">
          <FiEdit2
            id="Editar"
            className="icon cursor-pointer"
            onClick={handleEditClick}
          />
          <AiOutlineDelete id="deletar" className="icon cursor-pointer" />
        </div>

        <p className="uppercase !pt-5 text-xl !font-semibold">
          {isEditing ? (
			<Input
              value={nomeEdit}
              onChange={setNomeEdit}
            />
          ) : (
            nomeEdit
          )}
        </p>

        <p className="!mt-3 text-lg flex gap-2 items-center justify-center p-0">
          Email:{" "}
          {isEditing ? (
			<Input
			type="email"
			value={emailEdit}
			onChange={setEmailEdit}
		  />
          ) : (
            <span className="!font-semibold">{emailEdit}</span>
          )}
        </p>

        <p className="!pt-4 text-lg">
          Endereço: <span className="!font-semibold">Rua Da Saúde nº12 - 06352-663 - SP</span>
        </p>

        {/* Botão para salvar alterações */}
        {isEditing && (
          <Button onClick={handleSave} className="mt-[3rem]"> Salvar </Button>
        )}
      </div>

    </section>
  );
}
