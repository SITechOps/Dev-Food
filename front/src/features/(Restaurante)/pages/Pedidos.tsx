import { useAuth } from "@/shared/contexts/AuthContext";
import { PedidosProvider } from "@/shared/contexts/PedidosContext";
import PedidosContent from "../components/Pedidos/PedidosContent";

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
