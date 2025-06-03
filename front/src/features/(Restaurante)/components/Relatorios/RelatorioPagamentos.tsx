import GraficoFormaPagamento from "./GraficoFormaPagamento";
import RelatorioBase from "./RelatorioBase";
import { FormaPagamentoItem } from "./GraficoFormaPagamento";

const RelatorioPagamento = () => {
  return (
    <RelatorioBase
      titulo="Relatório Formas de Pagamento"
      endpoint="/restaurante/relatorio-forma-pagamento"
      colunas={[
        { chave: "nome", titulo: "Restaurante" },
        { chave: "forma_pagamento_mais_usada", titulo: "Forma de Pagamento" },
        { chave: "total_usos", titulo: "Total de Usos" },
      ]}
      campoTotal="total_usos"
      autoLoad={true}
      renderTotal={(dados) => {
        if (!dados.length) return "—";

        const contagem = dados.reduce<Record<string, number>>((acc, item) => {
          const forma = String(item.forma_pagamento_mais_usada);
          acc[forma] = (acc[forma] || 0) + 1;
          return acc;
        }, {});

        const [maisUsada] = Object.entries(contagem).sort(
          (a, b) => b[1] - a[1],
        )[0];

        return maisUsada;
      }}
      renderExtra={(dados) => (
        <GraficoFormaPagamento dados={dados as FormaPagamentoItem[]} />
      )}
    />
  );
};

export default RelatorioPagamento;
