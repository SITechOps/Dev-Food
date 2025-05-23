import { useState } from "react";
import RelatorioReceita from "../components/Relatorios/RelatorioReceita";
import RelatorioPedidos from "../components/Relatorios/RelatorioPedidos";

const RelatoriosPage = () => {
  const [tipo, setTipo] = useState<"receita" | "pedidos">("receita");

  return (
    <div className="rounded-xl bg-white p-6">
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setTipo("receita")}
          className={`rounded px-4 py-2 font-medium ${
            tipo === "receita"
              ? "bg-brown-normal text-white"
              : "bg-gray-light text-gray-medium"
          }`}
        >
          Receita
        </button>
        <button
          onClick={() => setTipo("pedidos")}
          className={`rounded px-4 py-2 font-medium ${
            tipo === "pedidos"
              ? "bg-brown-normal text-white"
              : "bg-gray-light text-gray-medium"
          }`}
        >
          Pedidos
        </button>
      </div>

      {tipo === "receita" ? <RelatorioReceita /> : <RelatorioPedidos />}
    </div>
  );
};

export default RelatoriosPage;
