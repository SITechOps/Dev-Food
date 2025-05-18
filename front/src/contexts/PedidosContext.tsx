import { createContext, useState, useEffect } from "react";
import { IPedido } from "../interface/IPedidos";
import { usePedidosFetch } from "@/pages/Pedido/hooks/usePedidosFetch";
import { socket } from "../utils/socket";

interface PedidosContextData {
  pedidos: IPedido[];
  setPedidos: React.Dispatch<React.SetStateAction<IPedido[]>>;
  loading: boolean;
  error: string | null;
  listarPedidos: (idRestaurante: string) => Promise<void>;
  alterarStatus: (idPedido: string, novoStatus: string) => Promise<void>;
}

export const PedidosContext = createContext<PedidosContextData | undefined>(
  undefined,
);

interface PedidosProviderProps {
  children: React.ReactNode;
  idRestaurante: string;
}

export const PedidosProvider = ({
  children,
  idRestaurante,
}: PedidosProviderProps) => {
  const { fetchPedidos, updateStatus } = usePedidosFetch();

  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const listarPedidos = async () => {
    await fetchPedidos(idRestaurante, setPedidos, setLoading, setError);
  };

  const alterarStatus = async (idPedido: string, novoStatus: string) => {
    await updateStatus(idPedido, novoStatus, setPedidos);
  };

  useEffect(() => {
    if (!idRestaurante) return;

    listarPedidos();

    socket.on("pedido_criado", listarPedidos);
    socket.on("atualizar_status", listarPedidos);

    return () => {
      socket.off("pedido_criado", listarPedidos);
      socket.off("atualizar_status", listarPedidos);
    };
  }, [idRestaurante]);

  return (
    <PedidosContext.Provider
      value={{
        pedidos,
        setPedidos,
        loading,
        error,
        listarPedidos,
        alterarStatus,
      }}
    >
      {children}
    </PedidosContext.Provider>
  );
};
