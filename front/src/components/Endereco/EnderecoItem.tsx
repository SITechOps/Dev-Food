import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaBriefcase, FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

interface EnderecoItemProps {
  endereco: any;
  onDelete: (id: string) => void;
}

export default function EnderecoItem({ endereco, onDelete }: EnderecoItemProps) {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const { userData, token } = useAuth();
  const idUsuario = userData?.sub;

  const handleDelete = () => {
    if (window.confirm("Deseja excluir este endereço?")) {
      onDelete(`${endereco.id}?idUsuario=${idUsuario}`);
    }
  };

  const handleEdit = () => {
    const enderecoString = encodeURIComponent(JSON.stringify(endereco));
    navigate(`/c-endereco?endereco=${enderecoString}`);
  };
  return (
    <div className="relative rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Ícones de ação visíveis quando showActions estiver true */}
          {showActions && (
            <>
              <button
                onClick={handleEdit}
                className="text-white hover:text-blue bg-brown-normal p-4 rounded-full pointer-events-auto cursor-pointer"
                title="Editar"
              >
                <FaEdit />
              </button>
              <button
                onClick={handleDelete}
                className="text-white hover:text-blue bg-brown-normal p-4 rounded-full pointer-events-auto cursor-pointer"
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
          onClick={() => setShowActions(!showActions)}
          className="text-gray-medium hover:text-gray-dark"
        >
          <FaEllipsisV />
        </button>
      </div>
    </div>
  );
}