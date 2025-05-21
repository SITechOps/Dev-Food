import { useEffect, useState } from "react";
import Button from "@/shared/components/ui/Button";
import DateInputWithIcon from "@/shared/components/ui/DateInput";
import { api } from "@/lib/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Receita = {
  nome: string;
  porcentagem_total: string;
  receita_bruta: number;
};

const RelatorioReceita = () => {
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const [relatorio, setRelatorio] = useState<Receita[]>([]);
  const [carregando, setCarregando] = useState(false);

  const buscarRelatorio = async () => {
    setCarregando(true);
    try {
      const params =
        dataInicio && dataFim
          ? {
              dataInicio: format(dataInicio, "yyyy-MM-dd"),
              dataFim: format(dataFim, "yyyy-MM-dd"),
            }
          : undefined;

      const response = await api.get("/restaurante/relatorio-receita", {
        params,
      });
      setRelatorio(response.data.data || []);
    } catch (err) {
      console.error("Erro ao buscar relatório:", err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarRelatorio();
  }, []);

  const totalReceita = relatorio.reduce(
    (acc, item) => acc + item.receita_bruta,
    0,
  );

  return (
    <div className="rounded-xl bg-white p-6">
      <h2 className="text-brown-dark mb-4 text-xl font-semibold">
        Relatório de Receita
      </h2>

      <div className="mb-6">
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex flex-col">
            <label className="text-blue pb-2 text-sm">Data Início</label>
            <DatePicker
              selected={dataInicio}
              onChange={(date) => setDataInicio(date)}
              dateFormat="dd/MM/yyyy"
              locale={ptBR}
              placeholderText="dd/mm/yyyy"
              customInput={<DateInputWithIcon placeholder="dd/mm/yyyy" />}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-blue pb-2 text-sm">Data Fim</label>
            <DatePicker
              selected={dataFim}
              onChange={(date) => setDataFim(date)}
              dateFormat="dd/MM/yyyy"
              locale={ptBR}
              placeholderText="dd/mm/yyyy"
              customInput={<DateInputWithIcon />}
            />
          </div>

          <div>
            <Button
              onClick={buscarRelatorio}
              disabled={carregando}
              className="w-40 py-3"
            >
              {carregando ? "Carregando..." : "Filtrar"}
            </Button>
          </div>
        </div>

        <div className="mt-2 flex">
          <div className="flex flex-col">
            <Button
              color="plain"
              className="text-blue w-fit px-0 text-sm underline"
              onClick={() => {
                setDataInicio(null);
                setDataFim(null);
                buscarRelatorio();
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      <div className="border-gray-light overflow-x-auto rounded-md border">
        <table className="text-blue min-w-full text-left text-sm">
          <thead className="bg-brown-light text-brown-dark">
            <tr>
              <th className="px-4 py-3">Restaurante</th>
              <th className="px-4 py-3">Receita Bruta</th>
              <th className="px-4 py-3">% do Total</th>
            </tr>
          </thead>
          <tbody>
            {relatorio.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-5 text-center text-gray-500">
                  Nenhum dado encontrado.
                </td>
              </tr>
            ) : (
              <>
                {relatorio.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3">{item.nome}</td>
                    <td className="px-4 py-3">
                      R$ {item.receita_bruta.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{item.porcentagem_total}%</td>
                  </tr>
                ))}
                <tr className="text-brown-dark border-t font-semibold">
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3">R$ {totalReceita.toFixed(2)}</td>
                  <td className="px-4 py-3">100%</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RelatorioReceita;
