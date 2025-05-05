import { useState, useEffect, useCallback } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { api } from "../../connection/axios";
import Modal from "../ui/Modal";
import EnderecoItem from "./EnderecoItem";
import { useLocation, useNavigate } from "react-router-dom";
import ifoodLogo from "../../assets/ifood.png";
import Button from "../ui/Button";
import { IAddress } from "../../interface/IAddress";
import { useAuth } from "../../contexts/AuthContext";

interface ListagemEnderecoProps {
  onCloseModal?: () => void; // Prop opcional para fechar o modal
}

export default function ListagemEndereco({ onCloseModal }: ListagemEnderecoProps) {
  const [enderecos, setEnderecos] = useState<IAddress[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<IAddress | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { userData, token } = useAuth();
  const idUsuario = userData?.sub;
  const location = useLocation();
  const navigate = useNavigate();
  const [enderecoPadraoId, setEnderecoPadraoId] = useState<string | null>(localStorage.getItem("enderecoPadraoId"));
  const [confirmacaoPadrao, setConfirmacaoPadrao] = useState<{
    show: boolean;
    endereco: IAddress | null;
  }>({ show: false, endereco: null });

  const buscarEnderecos = useCallback(async () => {
    try {
      const response = await api.get(`/user/${idUsuario}/enderecos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const enderecosData = response.data?.data?.attributes || [];
      setEnderecos(enderecosData);
      const storedEnderecoPadraoId = localStorage.getItem("enderecoPadraoId");
      setEnderecoPadraoId(storedEnderecoPadraoId);
      if (storedEnderecoPadraoId) {
        const enderecoPadrao = enderecosData.find((end) => end.id === storedEnderecoPadraoId);
        setEnderecoSelecionado(enderecoPadrao || (enderecosData.length > 0 ? enderecosData[0] : null));
      } else if (enderecosData.length > 0) {
        setEnderecoSelecionado(enderecosData[0]);
      }
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
    }
  }, [idUsuario, token]);

  useEffect(() => {
    if (showModal) {
      buscarEnderecos();
    }
  }, [showModal, buscarEnderecos]);

  useEffect(() => {
    if (location.pathname === "/account" && showModal) {
      setShowModal(false);
    }
  }, [location.pathname, showModal]);

  const handleDeleteEndereco = async (id: string) => {
    try {
      await api.delete(`/endereco/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await buscarEnderecos();
    } catch (error) {
      console.error("Erro ao excluir endereço:", error);
    }
  };

  const handleSelecionarEndereco = (endereco: IAddress) => {
    setConfirmacaoPadrao({ show: true, endereco });
  };

  const confirmarEnderecoPadrao = (endereco: IAddress) => {
    localStorage.setItem("enderecoPadraoId", endereco.id);
    localStorage.setItem("enderecoPadrao", JSON.stringify(endereco));
    setEnderecoPadraoId(endereco.id);
    setConfirmacaoPadrao({ show: false, endereco: null });
    window.location.reload();
  };

  const cancelarEnderecoPadrao = () => {
    setConfirmacaoPadrao({ show: false, endereco: null });
  };

  const fecharModalEndereco = () => {
    if (onCloseModal) {
      onCloseModal();
    } else {
      setShowModal(false); // Caso o onCloseModal não seja passado como prop
    }
  };

  const filteredEnderecos = enderecos.filter((endereco) =>
    endereco.logradouro.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <p
        className="flex cursor-pointer items-center justify-between border-b p-4"
        onClick={() => setShowModal(true)}
      >
        <span className="text-blue text-lg font-semibold">
          {enderecoSelecionado?.logradouro || "Adicionar endereço"}
        </span>
        <IoIosArrowDown
          className={`icon transition-transform ${showModal ? "rotate-180" : ""}`}
        />
      </p>

      <Modal isOpen={showModal} onClose={fecharModalEndereco}> {/* Usando fecharModalEndereco no onClose */}
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
            <EnderecoItem
              key={endereco.id}
              endereco={endereco}
              onDelete={handleDeleteEndereco}
              isSelected={endereco.id === enderecoPadraoId}
              onSelect={handleSelecionarEndereco}
              onEdit={fecharModalEndereco} // Passando a função para fechar o modal
            />
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

      {confirmacaoPadrao.show && (
        <Modal isOpen={confirmacaoPadrao.show} onClose={cancelarEnderecoPadrao}>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Definir como endereço padrão?</h2>
            <p className="mb-4">
              Deseja selecionar "{confirmacaoPadrao.endereco?.logradouro}, {confirmacaoPadrao.endereco?.numero} - {confirmacaoPadrao.endereco?.bairro}, {confirmacaoPadrao.endereco?.cidade}" como seu endereço padrão?
            </p>
            <div className="flex justify-end space-x-2">
              <Button onClick={cancelarEnderecoPadrao} variant="secondary">
                Cancelar
              </Button>
              <Button onClick={() => confirmarEnderecoPadrao(confirmacaoPadrao.endereco!)}>
                Confirmar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}