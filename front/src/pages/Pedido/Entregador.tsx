import EntregadorContent from "./components/Restaurante/EntregadorContent";
import { useAuth } from "@/contexts/AuthContext";
import { PedidosProvider } from "@/contexts/PedidosContext";

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
