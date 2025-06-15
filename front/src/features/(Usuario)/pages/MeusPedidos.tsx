import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useAuth } from "@/shared/contexts/AuthContext";
import { IMeusPedidos } from "@/features/(Usuario)/interface/IMeusPedidos";
import HistoricoDePedido from "@/features/(Usuario)/components/Pedidos/HistoricoDePedido";
import Loading from "../components/Pedidos/Loading";

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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mt-[5rem] px-4">
      <h1 className="mb-6 text-2xl font-bold">Meus pedidos</h1>
      <HistoricoDePedido tipo="meuPedido" pedidos={pedidos} />

      <h1 className="mb-6 text-2xl font-bold">Histórico</h1>
      <HistoricoDePedido tipo="historico" pedidos={pedidos} />
    </div>
  );
}
