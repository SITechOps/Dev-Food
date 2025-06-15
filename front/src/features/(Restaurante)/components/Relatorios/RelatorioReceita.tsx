import RelatorioBase from "./RelatorioBase";

const RelatorioReceita = () => {
  return (
    <RelatorioBase
      titulo="Relatório de Receita"
      endpoint="/restaurante/relatorio-receita"
      colunas={[
        { chave: "nome", titulo: "Restaurante" },
        {
          chave: "receita_bruta",
          titulo: "Receita Bruta",
          formatador: (valor) => `R$ ${Number(valor).toFixed(2)}`,
        },
        { chave: "porcentagem_total", titulo: "% do Total" },
      ]}
      campoTotal="receita_bruta"
      prefixoMoeda
      autoLoad={true}
    />
  );
};

export default RelatorioReceita;
