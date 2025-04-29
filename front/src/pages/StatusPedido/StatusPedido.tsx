import { useEffect, useState } from "react";
import { api } from "../../connection/axios";
import { useAuth } from "../../contexts/AuthContext";
import { useUserAccount } from "../../hooks/useUserAccount";
import Button from "@/components/ui/Button";
import { pedidosUtils } from "../../utils/pedidosUtils";
import { Loading } from "@/components/shared/Loading";

const statusMessages: { [key: string]: string } = {
  Pendente: "Aguardando a confirmação do restaurante.",
  "Em preparo": "O pedido está sendo preparado.",
  Despachado: "O pedido saiu para entrega.",
  Entregue: "Pedido entregue!",
  Cancelado: "Seu pedido foi cancelado pelo restaurante.",
};

const statusSteps: { [key: string]: number } = {
  Pendente: 0,
  "Em preparo": 1,
  Despachado: 2,
  Entregue: 3,
};

export default function OrderStatusTracker() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatarData } = pedidosUtils();
  const { userData } = useAuth();
  const { userFormList } = useUserAccount();
  const idUsuario = userData?.sub;

  useEffect(() => {
    const fetchPedidosUsuario = async () => {
      if (!idUsuario) return;
      try {
        const response = await api.get(`/pedidos/usuario/${idUsuario}`);
        setPedidos(response.data.pedidos || []);
      } catch (error) {
        console.error("Erro ao buscar pedidos do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidosUsuario();
  }, [idUsuario]);

  const marcarComoEntregue = async (idPedido: string) => {
    try {
      await api.patch(`/pedido/status/${idPedido}`, { status: "Entregue" });

      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.Id === idPedido ? { ...pedido, status: "Entregue" } : pedido,
        ),
      );
      alert("Pedido marcado como entregue!");
    } catch (error) {
      alert("Erro ao marcar pedido como entregue.");
    }
  };

  const getCodigoPedido = (pedidoId: string) => {
    if (userFormList?.telefone) {
      const numeros = userFormList.telefone.replace(/\D/g, "");
      if (numeros.length >= 4) {
        return numeros.slice(-4);
      }
    }
    return pedidoId.slice(0, 4);
  };

  if (loading) {
    return <Loading />;
  }

  const pedidosEmAberto = pedidos.filter((p) => p.status !== "Entregue");

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-2xl border bg-white p-6 shadow-md">
      <h2 className="text-blue mb-6 text-center text-2xl font-bold">
        Seus pedidos
      </h2>

      {pedidosEmAberto.length === 0 ? (
        <p className="text-gray-medium text-center">
          Nenhum pedido em andamento.
        </p>
      ) : (
        pedidosEmAberto.map((pedido) => {
          const step = statusSteps[pedido.status] ?? 0;
          const steps = 4;

          return (
            <div
              key={pedido.Id}
              className="mb-8 rounded-xl border bg-gray-50 p-4 shadow-sm"
            >
              <h3 className="text-blue text-lg font-semibold">
                Acompanhamento do pedido
              </h3>

              <p className="text-gray-medium mb-2 text-sm">
                {formatarData(pedido.data_pedido)}
              </p>

              <div className="mb-2 flex items-center justify-between">
                {[...Array(steps)].map((_, index) => (
                  <div
                    key={index}
                    className={`mx-1 h-1 flex-1 rounded-full ${
                      index <= step ? "bg-green" : "bg-gray-medium"
                    }`}
                  />
                ))}
              </div>

              <p className="text-blue mt-4 mb-4 text-center">
                {statusMessages[pedido.status] ?? "Status desconhecido"}
              </p>

              <div className="mb-4 text-center text-xs text-gray-500">
                Código do pedido: <strong>{getCodigoPedido(pedido.Id)}</strong>
              </div>

              {pedido.status === "Despachado" && (
                <Button
                  color="default"
                  className="bg-green-dark hover:bg-green text-white"
                  onClick={() => marcarComoEntregue(pedido.Id)}
                >
                  Marcar como entregue
                </Button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
