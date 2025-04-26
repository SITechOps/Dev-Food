import { usePedidos } from "@/hooks/usePedidos";
import PainelPedidos from "@/components/Restaurante/PainelPedidos";
import { useAuth } from "@/contexts/AuthContext"; // supondo que você pegue o idRestaurante daqui

export default function Pedidos() {
  const { userData } = useAuth(); // assumindo que você já tenha isso
  const idRestaurante = userData?.sub;

  const { pedidos, loading, error } = usePedidos(idRestaurante);

  // Mapear pedidos da API para o formato que o PainelPedidos entende
  const orders = pedidos.map((pedido) => ({
    id: pedido.id,
    customer: pedido.endereco?.bairro ?? "", // ou outro campo que quiser
    deliveryTime: "", // Se quiser calcular baseado em dataPedido
    dispatchedAt: "", // Se quiser calcular depois
    status: "to_accept" as const, // Aqui está fixo, mas você pode mudar dependendo do seu fluxo
  }));

  if (loading) {
    return <div className="p-4">Carregando pedidos...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Erro ao carregar pedidos.</div>;
  }

  return (
    <>
      <PainelPedidos orders={orders} />
    </>
  );
}
