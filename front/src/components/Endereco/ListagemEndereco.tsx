import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { api } from "../../connection/axios";
import Modal from "../ui/Modal";
import EnderecoItem from "./EnderecoItem";
import { useLocation, useNavigate } from "react-router-dom";
import ifoodLogo from "../../assets/ifood.png";
import Button from "../ui/Button";
import { IAddress } from "../../interface/IAddress";
import { useAuth } from "../../contexts/AuthContext";

export default function ListagemEndereco() {
  const [enderecos, setEnderecos] = useState<IAddress[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { userData, token } = useAuth();
  const idUsuario = userData?.sub;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/account" && showModal) {
      setShowModal(false);
    }
  }, [location.pathname, showModal]);

  async function mostrarEnderecoSalvo() {
    try {
      const response = await api.get(`/user/${idUsuario}/enderecos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const enderecosData = response.data?.data?.attributes || [];
      setEnderecos(enderecosData);
      setIsExpanded(true);
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
    }
  }

  const handleDeleteEndereco = async (id: string) => {
    try {
      await api.delete(`/endereco/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEnderecos(enderecos.filter((endereco) => endereco.id !== id));
    } catch (error) {
      console.error("Erro ao excluir endereço:", error);
    }
  };

  const filteredEnderecos = enderecos.filter((endereco) =>
    endereco.logradouro.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <p
        className="flex cursor-pointer items-center justify-between border-b p-4"
        onClick={mostrarEnderecoSalvo}
      >
        <span className="text-blue text-lg font-semibold">
          {enderecos[0]?.logradouro || "Adicionar endereço"}
        </span>
        <IoIosArrowDown
          className={`icon transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </p>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="mb-4 flex items-center">
          <img src={ifoodLogo} alt="iFood Logo" className="mr-2 h-8" />
          <h2 className="text-blue text-lg font-semibold">Meus Endereços</h2>
        </div>

        <input
          type="text"
          placeholder="Buscar endereço..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full rounded-md border p-2"
        />
        <div className="space-y-2">
          {filteredEnderecos.map((endereco) => (
            <>
              <EnderecoItem
                key={endereco.id}
                endereco={endereco}
                onDelete={handleDeleteEndereco}
              />
            </>
          ))}
        </div>
        <Button
          className="mt-6"
          onClick={() => {
            setShowModal(false);
            navigate("/c-endereco");
          }}
        >
          Adicionar novo endereço
        </Button>
      </Modal>
    </>
  );
}
