import { useState, useMemo } from "react";
import { usePedidosContext } from "@/contexts/usePedidosContext";
import DetalhesPedido from "@/components/Restaurante/DetalhesPedido";
import PainelPedidos from "@/components/Restaurante/PainelPedidos";

export default function PedidosContent() {
  const { pedidos, error } = usePedidosContext();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [abaSelecionada, setAbaSelecionada] = useState<"padrão" | "rápida">(
    "padrão",
  );

  const pedidosPadrao = useMemo(
    () =>
      pedidos.filter(
        (pedido) =>
          pedido.tipoEntrega !== "Rápida" &&
          pedido.status !== "Cancelado" &&
          pedido.status !== "Entregue",
      ),
    [pedidos],
  );

  const pedidosRapida = useMemo(
    () =>
      pedidos.filter(
        (pedido) =>
          pedido.tipoEntrega === "Rápida" &&
          pedido.status !== "Cancelado" &&
          pedido.status !== "Entregue",
      ),
    [pedidos],
  );

  const pedidosFiltrados = useMemo(() => {
    return abaSelecionada === "padrão" ? pedidosPadrao : pedidosRapida;
  }, [abaSelecionada, pedidosPadrao, pedidosRapida]);

  const selectedPedido =
    pedidosFiltrados.find((pedido) => pedido.id === selectedId) || null;

  if (error)
    return <div className="text-brown-dark p-4">Erro ao carregar pedidos.</div>;

  return (
    <div className="flex h-screen font-sans">
      <div className="w-1/3 overflow-y-auto rounded-[10px] bg-white p-4">
        <div className="mb-4 flex w-full justify-around">
          <button
            onClick={() => setAbaSelecionada("padrão")}
            className={`relative flex items-center gap-2 text-lg font-medium transition-all duration-300 ${
              abaSelecionada === "padrão"
                ? "border-b-brown-normal text-brown-normal border-b-2"
                : "text-gray-medium"
            }`}
          >
            Padrão
            {pedidosPadrao.length > 0 && (
              <div className="bg-brown-normal flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
                {pedidosPadrao.length}
              </div>
            )}
          </button>

          <button
            onClick={() => setAbaSelecionada("rápida")}
            className={`relative flex items-center gap-2 text-lg font-medium transition-all duration-300 ${
              abaSelecionada === "rápida"
                ? "border-b-brown-normal text-brown-normal border-b-2"
                : "text-gray-medium"
            }`}
          >
            Rápida
            {pedidosRapida.length > 0 && (
              <div className="bg-brown-normal flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
                {pedidosRapida.length}
              </div>
            )}
          </button>
        </div>

        <PainelPedidos
          orders={pedidosFiltrados}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </div>

      <div className="bg-gray-light flex-1 overflow-y-auto p-8">
        {selectedPedido ? (
          <DetalhesPedido pedido={selectedPedido} />
        ) : (
          <p className="text-blue text-center">
            Selecione um pedido para ver detalhes
          </p>
        )}
      </div>
    </div>
  );
}
