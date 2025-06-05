import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export type FormaPagamentoItem = {
  forma_pagamento: string;
  restaurante?: string;
  total_gasto: number;
};

type Props = {
  dados: FormaPagamentoItem[];
};

const COLORS = [
  "#ee4c58",
  "#b5c865",
  "#69aa71",
  "#ff9800",
  "#3b5997",
  "#374957",
  "#fac8cb",
];

const GraficoFormaPagamento = ({ dados }: Props) => {
  if (!dados || dados.length === 0) {
    return <p className="text-gray-medium">Nenhum dado disponível.</p>;
  }

  const dadosAgrupados = dados.reduce<Record<string, number>>((acc, item) => {
    const chave = item.forma_pagamento;
    acc[chave] = (acc[chave] || 0) + item.total_gasto;
    return acc;
  }, {});

  const dadosGrafico = Object.entries(dadosAgrupados).map(
    ([formaPagamento, total], index) => ({
      nome: formaPagamento,
      valor: total,
      cor: COLORS[index % COLORS.length],
    }),
  );

  return (
    <div className="border-gray-light h-80 w-full rounded-xl border bg-white p-4">
      <h2 className="text-blue mb-4 text-lg font-semibold">
        Distribuição por Forma de Pagamento
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dadosGrafico}
            dataKey="valor"
            nameKey="nome"
            outerRadius={100}
            label
          >
            {dadosGrafico.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.cor} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoFormaPagamento;
