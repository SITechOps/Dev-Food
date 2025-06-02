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
      renderExtra={(dados) => (
        <GraficoFormaPagamento dados={dados as FormaPagamentoItem[]} />
      )}
    />
  );
};

export default RelatorioPagamento;
