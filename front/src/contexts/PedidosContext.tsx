import { createContext, useState, useEffect } from "react";
import { IPedido } from "../interface/IPedidos";
import { usePedidosFetch } from "@/hooks/usePedidosFetch";

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

  useEffect(() => {
    if (idRestaurante) {
      listarPedidos();
    }
  }, [idRestaurante]);

  const alterarStatus = async (idPedido: string, novoStatus: string) => {
    await updateStatus(idPedido, novoStatus, setPedidos);
  };

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
