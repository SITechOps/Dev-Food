import { ChevronDown, Search } from "lucide-react";

interface Order {
  id: string;
  customer?: string;
  deliveryTime?: string;
  dispatchedAt?: string;
  status: "to_accept" | "to_dispatch" | "delivering";
}

interface PainelPedidosProps {
  orders: Order[];
}

export default function PainelPedidos({ orders }: PainelPedidosProps) {
  const toAccept = orders.filter((order) => order.status === "to_accept");
  const toDispatch = orders.filter((order) => order.status === "to_dispatch");
  const delivering = orders.filter((order) => order.status === "delivering");

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between border-b border-gray-300 pb-2">
        <div className="flex gap-4">
          <span className="font-semibold text-red-500">
            Agora{" "}
            <span className="rounded-full bg-red-500 px-2 text-xs text-white">
              {orders.length}
            </span>
          </span>
          <span className="text-gray-400">Agendados</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar pedido"
          className="w-full rounded-lg border py-2 pr-3 pl-10 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
        />
      </div>

      {/* Aceitar pedidos */}
      <div className="rounded-xl bg-gray-100 p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-semibold text-gray-700">
            Aceitar pedidos{" "}
            <span className="rounded-full bg-gray-400 px-2 text-xs text-white">
              {toAccept.length + toDispatch.length}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>

        {toAccept.length + toDispatch.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-400">
            Nenhum pedido no momento
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {toAccept.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-2 rounded-lg border p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">#{order.id}</span>
                  <div className="rounded-lg bg-gray-200 px-2 py-1 text-xs text-gray-600">
                    2 min
                  </div>
                </div>
                <button className="rounded-md bg-red-500 py-2 text-sm font-semibold text-white">
                  Aceitar pedido
                </button>
              </div>
            ))}

            {toDispatch.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-2 rounded-lg border p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold">
                      #{order.id}{" "}
                      {order.customer && <span>{order.customer}</span>}
                    </span>
                    {order.deliveryTime && (
                      <span className="text-gray-500">
                        Entregue até {order.deliveryTime}
                      </span>
                    )}
                  </div>
                </div>
                <button className="rounded-md bg-green-500 py-2 text-sm font-semibold text-white">
                  Despachar pedido
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Em entrega */}
      <div className="rounded-xl bg-gray-100 p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-semibold text-gray-700">
            Em entrega{" "}
            <span className="rounded-full bg-gray-400 px-2 text-xs text-white">
              {delivering.length}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>

        {delivering.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-400">
            Nenhum pedido no momento
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {delivering.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-2 rounded-lg border p-3"
              >
                <div className="flex flex-col text-sm">
                  <span className="font-semibold">
                    #{order.id}{" "}
                    {order.customer && <span>{order.customer}</span>}
                  </span>
                  {order.dispatchedAt && (
                    <span className="text-gray-500">
                      Despachado há {order.dispatchedAt}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
