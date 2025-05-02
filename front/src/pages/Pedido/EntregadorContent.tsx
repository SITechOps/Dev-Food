import { useState } from "react";
import ModalCodigoVerificacao from "@/components/shared/ModalCodigoVerificacao";
import { api } from "@/connection/axios";
import Button from "@/components/ui/Button";
import { usePedidosContext } from "@/contexts/usePedidosContext";

export default function EntregadorContent() {
  const { pedidos } = usePedidosContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<{
    id: string;
    codigo: string;
    telefone: string;
  } | null>(null);

  const abrirModalEntrega = (pedidoId: string, telefone: string) => {
    const numeros = telefone.replace(/\D/g, "");
    const codigo =
      numeros.length >= 4 ? numeros.slice(-4) : pedidoId.slice(0, 4);
    setPedidoSelecionado({ id: pedidoId, codigo, telefone });
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

  const pedidosDespachados = pedidos.filter(
    (pedido) => pedido.status === "Despachado",
  );

  return (
    <div className="rounded bg-white p-6">
      <h1 className="mb-4 text-xl font-bold">Entregador - Pedidos Pendentes</h1>

      <div className="flex flex-col gap-4">
        {pedidosDespachados.length > 0 ? (
          pedidosDespachados.map((pedido) => (
            <div
              key={pedido.id}
              className="flex w-fit flex-col items-center gap-2 rounded border bg-white p-4 shadow"
            >
              <div className="flex w-full flex-col pb-3">
                <label className="text-gray-medium text-lg font-medium">
                  Pedido: <span className="text-blue">{pedido.id}</span>
                </label>

                <label className="text-gray-medium text-lg font-medium">
                  Cliente: <span className="text-blue">{pedido.cliente}</span>
                </label>
              </div>
              <Button
                onClick={() => abrirModalEntrega(pedido.id!, pedido.codigo!)}
                className="w-xs"
              >
                Confirmar entrega
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-medium">
            Nenhum pedido disponível para entrega
          </p>
        )}
      </div>

      {pedidoSelecionado && isModalOpen && (
        <ModalCodigoVerificacao
          qtd_digitos={4}
          idPedido={pedidoSelecionado.id}
          codigoEnviado={pedidoSelecionado.codigo}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          tipoEnvioCodigo="Entregador"
          onSuccess={handleConfirmacaoEntrega}
        />
      )}
    </div>
  );
}
