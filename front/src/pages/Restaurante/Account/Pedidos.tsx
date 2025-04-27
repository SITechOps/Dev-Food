import { useState } from "react";
import { usePedidos } from "@/hooks/usePedidos";
import DetalhesPedido from "@/components/Restaurante/DetalhesPedido";
import PainelPedidos from "@/components/Restaurante/PainelPedidos";
import { useAuth } from "@/contexts/AuthContext";
import { IPedido } from "../../../interface/IPedidos";

export default function Pedidos() {
  const { userData } = useAuth();
  const idRestaurante = userData?.sub;

  const { pedidos, calcularDiferencaTempo, error } = usePedidos(idRestaurante);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [abaSelecionada, setAbaSelecionada] = useState<"agora" | "agendado">(
    "agora",
  );

  const pedidosAgora = pedidos.filter(
    (pedido) => pedido.tipoEntrega !== "Agendado",
  );
  const pedidosAgendado = pedidos.filter(
    (pedido) => pedido.tipoEntrega === "Agendado",
  );

  const pedidosFiltrados =
    abaSelecionada === "agora" ? pedidosAgora : pedidosAgendado;

  const selectedPedido: IPedido | null =
    pedidos.find((pedido) => pedido.id === selectedId) || null;

  if (error) {
    return <div className="text-brown-dark p-4">Erro ao carregar pedidos.</div>;
  }

  return (
    <div className="flex h-screen font-sans">
      <div className="w-1/3 overflow-y-auto rounded-[10px] bg-white p-4">
        <div className="mb-4 flex w-full justify-around">
          <button
            onClick={() => setAbaSelecionada("agora")}
            className={`relative flex items-center gap-2 text-lg font-medium transition-all duration-300 ${
              abaSelecionada === "agora"
                ? "border-b-brown-normal text-brown-normal border-b-2"
                : "text-gray-medium"
            }`}
          >
            Agora
            <div className="bg-brown-normal flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
              {pedidosAgora.length}
            </div>
          </button>

          <button
            onClick={() => setAbaSelecionada("agendado")}
            className={`relative flex items-center gap-2 text-lg font-medium transition-all duration-300 ${
              abaSelecionada === "agendado"
                ? "border-b-brown-normal text-brown-normal border-b-2"
                : "text-gray-medium"
            }`}
          >
            Agendado
            <div className="bg-brown-normal flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
              {pedidosAgendado.length}
            </div>
          </button>
        </div>

        <PainelPedidos
          orders={pedidosFiltrados}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          calcularDiferencaTempo={calcularDiferencaTempo}
        />
      </div>

      <div className="bg-gray-light flex-1 overflow-y-auto p-8">
        {selectedPedido ? (
          <DetalhesPedido pedido={selectedPedido} />
        ) : (
          <p className="text-gray-medium">
            Selecione um pedido para ver detalhes
          </p>
        )}
      </div>
    </div>
  );
}
