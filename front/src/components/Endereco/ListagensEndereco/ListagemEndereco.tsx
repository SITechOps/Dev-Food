import { IoIosArrowDown } from "react-icons/io";
import Modal from "@/components/ui/Modal";
import EnderecoItem from "./EnderecoItem";
import TechOpsLogo from "@/assets/techops.png";
import Button from "../../ui/Button";
import { useListaEndereco } from "@/hooks/useListagemEndereco";

interface ListagemEnderecoProps {
  onCloseModal?: () => void;
}

export default function ListagemEndereco({
  onCloseModal,
}: ListagemEnderecoProps) {
  const {
    enderecoSelecionado,
    enderecos,
    showModal,
    setShowModal,
    searchTerm,
    setSearchTerm,
    handleDeleteEndereco,
    fecharModalEndereco,
    filteredEnderecos,
    mostrarConfirmacao,
    confirmarEnderecoPadrao,
    cancelarConfirmacao,
    confirmacaoPadrao,
    enderecoPadraoId,
    navigate,
  } = useListaEndereco(onCloseModal);

  return (
    <>
      <p
        className="text-blue flex cursor-pointer items-center justify-between border-b p-4"
        onClick={() => setShowModal(true)}
      >
        <span className="text-lg font-semibold">
          {enderecoSelecionado
            ? enderecoSelecionado.logradouro
            : enderecos.length === 0
              ? "Adicionar endereço"
              : "Selecionar endereço"}
        </span>
        <IoIosArrowDown
          className={`icon transition-transform ${showModal ? "rotate-180" : ""}`}
        />
      </p>

      {/* Modal Principal */}
      <Modal isOpen={showModal} className="w-120" onClose={fecharModalEndereco}>
        <div className="mb-4 flex items-center">
          <img src={TechOpsLogo} alt="TechOps Logo" className="mr-2 h-8" />
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
              onSelect={mostrarConfirmacao}
              onEdit={fecharModalEndereco}
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
        <Modal isOpen={confirmacaoPadrao.show} onClose={cancelarConfirmacao}>
          <div className="text-blue p-4">
            <h2 className="mb-2 text-lg font-semibold">
              Definir como endereço padrão?
            </h2>
            <p className="mb-4">
              Deseja selecionar "{confirmacaoPadrao.endereco?.logradouro},{" "}
              {confirmacaoPadrao.endereco?.numero} -{" "}
              {confirmacaoPadrao.endereco?.bairro},{" "}
              {confirmacaoPadrao.endereco?.cidade}" como seu endereço padrão?
            </p>
            <div className="flex justify-end space-x-2">
              <Button onClick={cancelarConfirmacao} color="secondary">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  confirmarEnderecoPadrao(confirmacaoPadrao.endereco!);
                  setShowModal(false);
                }}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
