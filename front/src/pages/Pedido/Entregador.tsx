import { useState } from "react";
import ModalCodigoVerificacao from "@/components/shared/ModalCodigoVerificacao";
import { api } from "@/connection/axios";
import Button from "@/components/ui/Button";

const Entregador = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<{
    id: string;
    codigo: string;
  } | null>(null);

  const abrirModalEntrega = (pedidoId: string, telefone: string) => {
    const numeros = telefone.replace(/\D/g, "");
    const codigo =
      numeros.length >= 4 ? numeros.slice(-4) : pedidoId.slice(0, 4);
    setPedidoSelecionado({ id: pedidoId, codigo });
    setIsModalOpen(true);
  };

  const handleConfirmacaoEntrega = async () => {
    if (!pedidoSelecionado) return;

    try {
      await api.patch(`/pedido/status/${pedidoSelecionado.id}`, {
        status: "Entregue",
      });
      alert("Pedido confirmado como entregue!");
    } catch (error) {
      alert("Erro ao confirmar entrega do pedido.");
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex w-fit flex-col items-center justify-center">
        <Button
          onClick={() =>
            abrirModalEntrega("id-do-pedido-aqui", "telefone-do-cliente")
          }
          className="rounded px-4 py-2 text-white"
        >
          Confirmar entrega
        </Button>
        {pedidoSelecionado && isModalOpen && (
          <ModalCodigoVerificacao
            idPedido={pedidoSelecionado.id}
            codigoEnviado={pedidoSelecionado.codigo}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            tipoEnvioCodigo="Entregador"
            onSuccess={handleConfirmacaoEntrega}
          />
        )}
      </div>
    </>
  );
};

export default Entregador;
