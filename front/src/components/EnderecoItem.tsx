import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../connection/axios";
import { AiOutlineDelete } from "react-icons/ai";
import { FaHome, FaBriefcase } from "react-icons/fa"; // Importe os ícones

interface EnderecoItemProps {
  endereco: any;
  onDelete: (id: string) => void;
}

export default function EnderecoItem({
  endereco,
  onDelete,
}: EnderecoItemProps) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Deseja excluir este endereço?")) {
      onDelete(endereco.id);
    }
  };

  return (
    <div className="relative rounded-md border p-4">
      <div className="flex items-center justify-between">
        <p>{endereco.logradouro}</p>
        <div className="flex items-center">
          {endereco.tipo === "casa" ? (
            <FaHome className="text-blue mr-2" />
          ) : endereco.tipo === "trabalho" ? (
            <FaBriefcase className="text-blue mr-2" />
          ) : null}
          <div>
            <p className="text-blue font-semibold">{endereco.logradouro}</p>
            <p className="text-gray-medium">
              {endereco.bairro}, {endereco.cidade}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-gray-medium"
        >
          ...
        </button>
      </div>

      {showMenu && (
        <div className="absolute top-10 right-0 rounded-md border bg-white p-2 shadow-md">
          <button
            onClick={() => navigate(`/account`)} // redirecionei para account pois é lá a responsabilidade do objeto endereço, que está atrelado a usuário
            className="block w-full p-1 text-left hover:bg-gray-100"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="block w-full p-1 text-left text-red-600 hover:bg-gray-100"
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}
