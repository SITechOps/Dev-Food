import { useState } from "react";
import RelatorioReceita from "../components/Relatorios/RelatorioReceita";
import RelatorioPedidos from "../components/Relatorios/RelatorioPedidos";
import RelatorioPagamentos from "../components/Relatorios/RelatorioPagamentos";

enum TipoRelatorio {
  Receita = "receita",
  Pedidos = "pedidos",
  Pagamentos = "pagamentos",
}

const componentesRelatorio: Record<TipoRelatorio, React.ReactNode> = {
  [TipoRelatorio.Receita]: <RelatorioReceita />,
  [TipoRelatorio.Pedidos]: <RelatorioPedidos />,
  [TipoRelatorio.Pagamentos]: <RelatorioPagamentos />,
};

const rotulos: Record<TipoRelatorio, string> = {
  [TipoRelatorio.Receita]: "Receita",
  [TipoRelatorio.Pedidos]: "Pedidos",
  [TipoRelatorio.Pagamentos]: "Pagamentos",
};

const RelatoriosPage = () => {
  const [tipo, setTipo] = useState<TipoRelatorio>(TipoRelatorio.Receita);

  return (
    <div className="rounded-xl bg-white p-6">
      <div className="mb-6 flex gap-4">
        {Object.values(TipoRelatorio).map((item) => (
          <button
            key={item}
            onClick={() => setTipo(item)}
            className={`rounded px-4 py-2 font-medium ${
              tipo === item
                ? "bg-brown-normal text-white"
                : "bg-gray-light text-gray-medium"
            }`}
          >
            {rotulos[item]}
          </button>
        ))}
      </div>

      {componentesRelatorio[tipo]}
    </div>
  );
};

export default RelatoriosPage;
