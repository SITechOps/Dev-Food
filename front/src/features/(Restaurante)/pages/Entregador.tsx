import EntregadorContent from "../components/Pedidos/EntregadorContent";
import { useAuth } from "@/shared/contexts/AuthContext";
import { PedidosProvider } from "@/shared/contexts/PedidosContext";

export default function Entregador() {
  const { userData } = useAuth();
  const idRestaurante = userData?.sub;

  if (!idRestaurante) {
    return (
      <div className="text-brown-dark p-4">Restaurante não encontrado.</div>
    );
  }

  return (
    <PedidosProvider idRestaurante={idRestaurante}>
      <EntregadorContent />
    </PedidosProvider>
  );
}
