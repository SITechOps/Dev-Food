import RelatorioBase from "./RelatorioBase";

const RelatorioPedidos = () => {
  return (
    <RelatorioBase
      titulo="Relatório de Pedidos"
      endpoint="/restaurante/relatorio-pedidos"
      colunas={[
        { chave: "nome", titulo: "Restaurante" },
        {
          chave: "quantidade_pedidos",
          titulo: "Quantidade de Pedidos",
        },
        {
          chave: "porcentagem_total",
          titulo: "% do Total",
          formatador: (v) => `${v}%`,
        },
      ]}
      campoTotal="quantidade_pedidos"
      autoLoad={true}
    />
  );
};

export default RelatorioPedidos;
