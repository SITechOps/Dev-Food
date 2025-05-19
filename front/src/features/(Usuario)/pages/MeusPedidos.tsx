import HistoricoDePedido from "@/features/(Usuario)/components/Pedidos/HistoricoDePedido";
import { useEffect, useState } from "react";
import { api } from "@/connection/axios";
import { useAuth } from "@/contexts/AuthContext";
import { IMeusPedidos } from "@/interface/IMeusPedidos";

export default function MeusPedidos() {
  const { userData } = useAuth();
  const [pedidos, setPedidos] = useState<IMeusPedidos[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.sub) return;

    async function buscarPedidos() {
      setLoading(true);
      try {
        const { data } = await api.get(`/pedidos/usuario/${userData!.sub}`);
        setPedidos(data.pedidos);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarPedidos();
  }, [userData?.sub]);

  return (
    <div className="mt-[5rem]">
      <h1 className="mb-6 text-2xl font-bold">Meus pedidos</h1>
      <HistoricoDePedido tipo="meuPedido" pedidos={pedidos} loading={loading} />

      <h1 className="mb-6 text-2xl font-bold">Histórico</h1>
      <HistoricoDePedido tipo="historico" pedidos={pedidos} loading={loading} />
    </div>
  );
}
