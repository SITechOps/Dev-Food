import { useEffect, useState } from "react";
import { api } from "../../../lib/axios";
import { socket } from "../../../shared/utils/socket";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { useUserAccount } from "../hooks/useUserAccount";
import { pedidosUtils } from "../../../shared/utils/pedidosUtils";
import IconAction from "@/shared/components/ui/IconAction";
import { useNavigate } from "react-router";
import { showError, showSuccess, showWarning } from "@/shared/components/ui/AlertasPersonalizados/toastAlerta";

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
  const { formatarData, acrescentarHora } = pedidosUtils();
  const { userData } = useAuth();
  const { userFormList } = useUserAccount();
  const idUsuario = userData?.sub;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const fetchPedidosUsuario = async () => {
    if (!idUsuario) return;
    try {
      const response = await api.get(`/pedidos/usuario/${idUsuario}`);
      setPedidos(response.data.pedidos || []);
      showSuccess("Pedidos atualizados com sucesso");
    } catch (error) {
      console.error("Erro ao buscar pedidos do usuário:", error);
      showError("Erro ao buscar pedidos do usuário");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidosUsuario();

    socket.on("pedido_criado", fetchPedidosUsuario);
    socket.on("atualizar_status", fetchPedidosUsuario);

    return () => {
      socket.off("pedido_criado", fetchPedidosUsuario);
      socket.off("atualizar_status", fetchPedidosUsuario);
    };
  }, [idUsuario]);

  useEffect(() => {
    console.log("Pedidos atualizados:", pedidos);
    showWarning("Pedidos atualizados");
  }, [pedidos]);

  const getCodigoPedido = (pedidoId: string) => {
    if (userFormList?.telefone) {
      const numeros = userFormList.telefone.replace(/\D/g, "");
      if (numeros.length >= 4) {
        return numeros.slice(-4);
      }
    }
    return pedidoId.slice(0, 4);
  };

  const pedidosEmAberto = pedidos.filter((p) => p.status !== "Entregue");

  return (
    <>
      <IconAction
        className="text-brown-normal mt-6 ml-4 flex cursor-pointer items-center gap-2 hover:underline"
        onClick={() => navigate("/historico")}
      >
        <span className="text-lg font-medium">Voltar</span>
      </IconAction>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border bg-white p-6 shadow-md">
        <h2 className="text-blue mb-6 text-center text-2xl font-bold">
          Seus pedidos
        </h2>

        {isLoading ? (
          <p className="text-gray-medium text-center">Carregando pedidos...</p>
        ) : pedidosEmAberto.length === 0 ? (
          <p className="text-gray-medium text-center">
            Nenhum pedido em andamento.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {pedidosEmAberto.map((pedido) => {
              const step = statusSteps[pedido.status] ?? 0;
              const steps = 4;

              return (
                <div
                  key={pedido.Id}
                  className="border-gray-light rounded-xl border bg-white p-4 shadow-sm"
                >
                  <h3 className="text-blue text-lg font-semibold">
                    Acompanhamento do pedido
                  </h3>
                  <div className="my-3 flex w-full items-center justify-between">
                    <div>
                      <span className="text-gray-medium">
                        Previsão de entrega:
                      </span>
                      <p className="text-blue text-md mb-2 font-bold">
                        {formatarData(
                          acrescentarHora(pedido.data_pedido).toISOString(),
                        )}
                      </p>
                    </div>
                    <span className="text-gray-medium font-medium">
                      Atualização em tempo real
                    </span>
                  </div>

                  <div className="mb-2 flex items-center justify-between">
                    {[...Array(steps)].map((_, index) => (
                      <div
                        key={index}
                        className={`mx-1 h-1 flex-1 rounded-full ${
                          index <= step ? "bg-blue" : "bg-gray-medium"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="text-blue mt-4 mb-4 ml-1 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="bg-brown-normal absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                      <span className="bg-brown-normal relative inline-flex h-2 w-2 rounded-full"></span>
                    </span>
                    <p>
                      {statusMessages[pedido.status] ?? "Status desconhecido"}
                    </p>
                  </div>

                  <div className="flex w-full justify-center">
                    <div
                      className="border-brown-normal mb-4 flex w-fit flex-col gap-2 border px-10 py-3 text-center"
                      style={{ borderRadius: "10px" }}
                    >
                      <span className="text-gray-medium">
                        Código de confirmação de entrega
                      </span>
                      <span className="text-blue text-2xl font-semibold">
                        {getCodigoPedido(pedido.Id)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
