import { useAuth } from "@/contexts/AuthContext";
import { PedidosProvider } from "@/contexts/PedidosContext";
import PedidosContent from "@/pages/Pedido/components/Restaurante/PedidosContent";

export default function Pedidos() {
  const { userData } = useAuth();
  const idRestaurante = userData?.sub;

  if (!idRestaurante) {
    return (
      <div className="text-brown-dark p-4">Restaurante não encontrado.</div>
    );
  }

  return (
    <PedidosProvider idRestaurante={idRestaurante}>
      <PedidosContent />
    </PedidosProvider>
  );
}
