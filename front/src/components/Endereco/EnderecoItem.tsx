import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaEdit,
  FaTrash,
  FaEllipsisV,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

interface EnderecoItemProps {
  endereco: any;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect: (endereco: any) => void;
  onEdit?: () => void; // Nova prop para a função de fechar o modal
}

export default function EnderecoItem({
  endereco,
  onDelete,
  isSelected,
  onSelect,
  onEdit,
}: EnderecoItemProps) {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const { userData } = useAuth();
  const idUsuario = userData?.sub;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Deseja excluir este endereço?")) {
      onDelete(`${endereco.id}?idUsuario=${idUsuario}`);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(); // Chama a função para fechar o modal
    }
    const enderecoString = encodeURIComponent(JSON.stringify(endereco));
    navigate(`/c-endereco?id=${endereco.id}&endereco=${enderecoString}`);
  };

  return (
    <div
      className={`relative rounded-md border-2 p-4 ${
        isSelected ? "border-red-500" : "border-gray-300"
      } cursor-pointer`}
      onClick={() => onSelect(endereco)}
    >
      {isSelected && (
        <div className="absolute top-[-16px] left-0 rounded-md bg-green-500 px-2 py-0.5 text-xs font-semibold text-white">
          Padrão
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {showActions && (
            <>
              <button
                onClick={handleEdit} // A função handleEdit agora chama onEdit
                className="hover:text-blue bg-brown-normal pointer-events-auto cursor-pointer rounded-full p-4 text-white"
                title="Editar"
              >
                <FaEdit />
              </button>
              <button
                onClick={handleDelete}
                className="hover:text-blue bg-brown-normal pointer-events-auto cursor-pointer rounded-full p-4 text-white"
                title="Excluir"
              >
                <FaTrash />
              </button>
            </>
          )}

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
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className="text-gray-medium hover:text-gray-dark"
        >
          <FaEllipsisV />
        </button>
      </div>
    </div>
  );
}
