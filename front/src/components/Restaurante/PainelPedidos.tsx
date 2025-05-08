import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { usePedidosContext } from "@/contexts/usePedidosContext";
import { IPedido } from "../../interface/IPedidos";
import { pedidosUtils } from "../../utils/pedidosUtils";
import { useNavigate } from "react-router-dom";

interface PainelPedidosProps {
  orders: IPedido[];
  selectedId: string | null;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function PainelPedidos({
  orders,
  selectedId,
  setSelectedId,
}: PainelPedidosProps) {
  const [showPendentes, setShowPendentes] = useState(true);
  const [showDespachados, setShowDespachados] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { calcularDiferencaTempo } = pedidosUtils();
  const { alterarStatus } = usePedidosContext();
  const navigate = useNavigate();

  const pedidosPendentes = orders.filter(
    (pedido: IPedido) =>
      pedido.status === "Pendente" || pedido.status === "Em preparo",
  );
  const pedidosDespachados = orders.filter(
    (pedido: IPedido) => pedido.status === "Despachado",
  );

  const handleStatusChange = async (
    pedidoId: string,
    newStatus: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await alterarStatus(pedidoId, newStatus);
    } catch (error) {
      alert("Erro ao alterar status. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-auto flex-col gap-6">
      <div className="bg-gray-light rounded-[10px] p-2">
        <div
          className="mb-2 ml-1.5 flex cursor-pointer items-center justify-between"
          onClick={() => setShowPendentes(!showPendentes)}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-blue text-lg font-medium">Aceitar pedidos</h3>
            <div className="bg-gray-medium flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
              {pedidosPendentes.length}
            </div>
          </div>
          <ChevronRight
            className={`text-blue h-6 w-6 transform transition-transform ${showPendentes ? "rotate-90" : "rotate-0"}`}
          />
        </div>

        {showPendentes && (
          <div className="flex flex-col gap-4">
            {pedidosPendentes.map((pedido) => {
              const isSelected = selectedId === pedido.id;

              return (
                <div
                  key={pedido.id}
                  onClick={() =>
                    setSelectedId(isSelected ? null : pedido.id || null)
                  }
                  className={`flex cursor-pointer flex-col items-start justify-between rounded-lg p-4 font-bold ${
                    isSelected
                      ? "bg-brown-light border-brown-normal text-brown-normal border-2"
                      : "border-gray-medium text-blue border bg-white"
                  }`}
                >
                  <div className="mb-2 flex w-full items-center justify-between">
                    <span>#{pedido.id?.slice(0, 4)}</span>
                    <div className="bg-gray-light flex items-center rounded-2xl p-3">
                      <span className="text-blue text-sm font-semibold">
                        {calcularDiferencaTempo(pedido.dataPedido)}
                      </span>
                    </div>
                  </div>

                  {pedido.status === "Pendente" && (
                    <Button
                      color="default"
                      className="bg-brown-normal hover:bg-brown-dark text-white"
                      onClick={(e) =>
                        handleStatusChange(pedido.id!, "Em preparo", e)
                      }
                      isLoading={isLoading}
                    >
                      Aceitar pedido
                    </Button>
                  )}
                  {pedido.status === "Em preparo" && (
                    <Button
                      color="default"
                      className="bg-green-dark hover:bg-green text-white"
                      onClick={(e) =>
                        handleStatusChange(pedido.id!, "Despachado", e)
                      }
                      isLoading={isLoading}
                    >
                      Despachar pedido
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-gray-light rounded-[10px] p-2">
        <div
          className="mb-2 ml-1.5 flex cursor-pointer items-center justify-between"
          onClick={() => setShowDespachados(!showDespachados)}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-blue text-lg font-medium">Em entrega</h3>
            <div className="bg-gray-medium flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
              {pedidosDespachados.length}
            </div>
          </div>
          <ChevronRight
            className={`text-blue h-6 w-6 transform transition-transform ${showDespachados ? "rotate-90" : "rotate-0"}`}
          />
        </div>

        {showDespachados && (
          <div className="flex flex-col gap-4">
            {pedidosDespachados.map((pedido) => {
              const isSelected = selectedId === pedido.id;

              return (
                <div
                  key={pedido.id}
                  onClick={() =>
                    setSelectedId(isSelected ? null : pedido.id || null)
                  }
                  className={`flex cursor-pointer flex-col items-start justify-between gap-2 rounded-lg p-4 font-bold ${
                    isSelected
                      ? "bg-brown-light border-brown-normal text-brown-normal border-2"
                      : "border-gray-medium text-blue border bg-white"
                  }`}
                >
                  <div className="mb-2 flex w-full items-center justify-between">
                    <span>#{pedido.id?.slice(0, 4)}</span>
                  </div>

                  {pedido.status === "Despachado" && (
                    <p className="text-gray-medium text-sm font-normal">
                      {calcularDiferencaTempo(pedido.atualizadoEm)}
                    </p>
                  )}
                  <button
                    className="text-brown-normal cursor-pointer font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/entregador");
                    }}
                  >
                    Confirmar entrega
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
