import { useState } from "react";
import GraficoFormaPagamento, {
  FormaPagamentoItem,
} from "./GraficoFormaPagamento";
import RelatorioBase from "./RelatorioBase";

const RelatorioPagamento = () => {
  const [dadosRelatorio, setDadosRelatorio] = useState<FormaPagamentoItem[]>(
    [],
  );
  const [formaMaisUtilizadaGeral, setFormaMaisUtilizadaGeral] =
    useState<string>("");

  const transformarDados = (respostaApi: any): FormaPagamentoItem[] => {
    const restaurantes = respostaApi?.data?.restaurantes ?? [];

    setFormaMaisUtilizadaGeral(respostaApi?.data?.forma_mais_utilizada ?? "");

    const dados: FormaPagamentoItem[] = restaurantes.flatMap(
      (restaurante: any) =>
        restaurante.formas_pagamento.map((forma: any) => ({
          restaurante: restaurante.nome,
          forma_pagamento: forma.forma_pagamento,
          total_gasto: forma.total_gasto,
        })),
    );

    setDadosRelatorio(dados);

    return dados;
  };

  const totalGasto = dadosRelatorio.reduce(
    (acc, item) => acc + Number(item.total_gasto),
    0,
  );

  return (
    <RelatorioBase
      titulo="Relatório Formas de Pagamento"
      endpoint="/restaurante/relatorio-forma-pagamento"
      colunas={[
        { chave: "restaurante", titulo: "Restaurante" },
        { chave: "forma_pagamento", titulo: "Forma de Pagamento" },
        {
          chave: "total_gasto",
          titulo: "Total Gasto",
          formatador: (v) => `R$ ${Number(v).toFixed(2)}`,
        },
      ]}
      campoTotal="total_gasto"
      autoLoad={true}
      transformadorDeDados={transformarDados}
      valoresTotais={{
        forma_pagamento: formaMaisUtilizadaGeral,
        total_gasto: `R$ ${totalGasto.toFixed(2)}`,
      }}
      renderExtra={() => <GraficoFormaPagamento dados={dadosRelatorio} />}
    />
  );
};

export default RelatorioPagamento;
