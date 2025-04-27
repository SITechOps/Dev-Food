import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { IPedido } from "../../interface/IPedidos";
import Button from "@/components/ui/Button";

interface PainelPedidosProps {
  orders: IPedido[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  calcularDiferencaTempo: (data: string | undefined) => string;
}

export default function PainelPedidos({
  orders,
  selectedId,
  setSelectedId,
  calcularDiferencaTempo,
}: PainelPedidosProps) {
  const [showPendentes, setShowPendentes] = useState(true);
  const [showDespachados, setShowDespachados] = useState(true);

  const pedidosPendentes = orders.filter(
    (pedido) => pedido.status !== "Despachado",
  );
  const pedidosDespachados = orders.filter(
    (pedido) => pedido.status === "Despachado",
  );

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
            className={`text-blue h-6 w-6 transform transition-transform ${
              showPendentes ? "rotate-90" : "rotate-0"
            }`}
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
                      <span className="text-blue text-sm">
                        {calcularDiferencaTempo(pedido.dataPedido)}
                      </span>
                    </div>
                  </div>

                  {pedido.status === "Pendente" && (
                    <Button
                      color="default"
                      className="bg-brown-normal hover:bg-brown-dark text-white"
                    >
                      Aceitar pedido
                    </Button>
                  )}
                  {pedido.status === "Em preparo" && (
                    <Button
                      color="default"
                      className="bg-green-dark hover:bg-green text-white"
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
            className={`text-blue h-6 w-6 transform transition-transform ${
              showDespachados ? "rotate-90" : "rotate-0"
            }`}
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
                  className={`flex cursor-pointer flex-col items-start justify-between rounded-lg p-4 font-bold ${
                    isSelected
                      ? "bg-brown-light border-brown-normal text-brown-normal border-2"
                      : "border-gray-medium text-blue border bg-white"
                  }`}
                >
                  <div className="mb-2 flex w-full items-center justify-between">
                    <span>#{pedido.id?.slice(0, 4)}</span>
                  </div>

                  {pedido.status === "Despachado" && (
                    <>
                      <Button
                        color="default"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Em entrega
                      </Button>
                      <p className="text-gray-medium mt-2 text-sm font-normal">
                        Despachado há{" "}
                        {calcularDiferencaTempo(pedido.dataPedido)}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
