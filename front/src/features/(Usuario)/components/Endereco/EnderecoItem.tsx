import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaBriefcase, FaEllipsisV } from "react-icons/fa";
import { useAuth } from "@/shared/contexts/AuthContext";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";

interface EnderecoItemProps {
  endereco: any;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect: (endereco: any) => void;
  onEdit?: () => void;
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
  const iconStyle =
    "bg-brown-light hover:bg-brown-light-active flex h-8 w-8 cursor-pointer items-center justify-center rounded-full";

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
    const enderecoString = encodeURIComponent(JSON.stringify(endereco));
    navigate(`/c-endereco?id=${endereco.id}&endereco=${enderecoString}`);
  };

  return (
    <div
      className={`hover:border-brown-normal relative rounded-md border-2 p-4 ${
        isSelected ? "border-red-500" : "border-gray-300"
      } cursor-pointer`}
      onClick={() => onSelect(endereco)}
    >
      {isSelected && (
        <div className="absolute top-[-16px] left-0 rounded-md bg-green-500 px-2 py-0.5 text-xs font-semibold text-white">
          Padrão
        </div>
      )}

      <div className="flex items-center gap-4">
        {showActions && (
          <div className="flex cursor-pointer items-center gap-2">
            <button onClick={handleEdit} className={iconStyle} title="Editar">
              <FiEdit2 className="icon w-5" />
            </button>
            <button
              onClick={handleDelete}
              className={iconStyle}
              title="Excluir"
            >
              <AiOutlineDelete className="icon w-5" />
            </button>
          </div>
        )}

        <div className="flex gap-3">
          {endereco.tipo === "casa" ? (
            <FaHome className="text-blue text-2x1 h-6 w-6" />
          ) : endereco.tipo === "trabalho" ? (
            <FaBriefcase className="text-blue text-2x1" />
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
          className="absolute right-1 cursor-pointer"
        >
          <FaEllipsisV className="icon w-5" />
        </button>
      </div>
    </div>
  );
}
