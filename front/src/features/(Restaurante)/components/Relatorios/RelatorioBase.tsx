import { useEffect, useRef, useState } from "react";
import Button from "@/shared/components/ui/Button";
import DateInputWithIcon from "@/shared/components/ui/DateInput";
import { api } from "@/lib/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";

type RelatorioItem = Record<string, string | number>;

type Coluna = {
  chave: string;
  titulo: string;
  formatador?: (valor: string | number) => string;
};

type RelatorioBaseProps = {
  titulo: string;
  endpoint: string;
  colunas: Coluna[];
  mostrarTotal?: boolean;
  campoTotal?: string;
  prefixoMoeda?: boolean;
  autoLoad?: boolean;
  renderTotal?: (dados: RelatorioItem[]) => React.ReactNode;
  renderExtra?: (dados: RelatorioItem[]) => React.ReactNode;
};

const RelatorioBase = ({
  titulo,
  endpoint,
  colunas,
  mostrarTotal = true,
  campoTotal,
  prefixoMoeda = false,
  autoLoad = false,
  renderExtra,
  renderTotal,
}: RelatorioBaseProps) => {
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const [relatorio, setRelatorio] = useState<RelatorioItem[]>([]);
  const [carregando, setCarregando] = useState(false);

  const carregadoRef = useRef(false);

  const buscarRelatorio = async (ignorarFiltro = false) => {
    setCarregando(true);
    try {
      const params =
        !ignorarFiltro && dataInicio && dataFim
          ? {
              dataInicio: format(dataInicio, "yyyy-MM-dd"),
              dataFim: format(dataFim, "yyyy-MM-dd"),
            }
          : undefined;

      const response = await api.get(endpoint, { params });
      setRelatorio(response.data.data || []);
    } catch (err) {
      console.error("Erro ao buscar relatório:", err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (autoLoad && !carregadoRef.current) {
      carregadoRef.current = true;
      buscarRelatorio(true);
    }
  }, [autoLoad]);

  const total = campoTotal
    ? relatorio.reduce((acc, item) => acc + Number(item[campoTotal] || 0), 0)
    : 0;

  useEffect(() => {
    if (dataInicio === null && dataFim === null && carregadoRef.current) {
      buscarRelatorio(true);
    }
  }, [dataInicio, dataFim]);

  return (
    <div className="rounded-xl bg-white p-6">
      <h2 className="text-brown-dark mb-4 text-xl font-semibold">{titulo}</h2>

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
              customInput={<DateInputWithIcon />}
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
          <Button
            onClick={() => buscarRelatorio()}
            disabled={carregando}
            className="flex w-40 items-center justify-center gap-2 py-3"
          >
            {carregando && (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            )}
            {carregando ? "Carregando" : "Filtrar"}
          </Button>
        </div>
        <div className="mt-2 flex">
          <Button
            color="plain"
            className="text-blue w-fit px-0 text-sm underline"
            onClick={() => {
              carregadoRef.current = true;
              setDataInicio(null);
              setDataFim(null);
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      <div className="border-gray-light overflow-x-auto rounded-md border">
        <table className="text-blue min-w-full text-left text-sm">
          <thead className="bg-brown-light text-brown-dark">
            <tr>
              {colunas.map((col) => (
                <th key={col.chave} className="px-4 py-3">
                  {col.titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="border-t">
                  {colunas.map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      <div className="bg-brown-light h-4 w-3/4 animate-pulse rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : relatorio.length === 0 ? (
              <tr>
                <td
                  colSpan={colunas.length}
                  className="text-gray-medium px-4 py-5 text-center"
                >
                  Nenhum dado encontrado.
                </td>
              </tr>
            ) : (
              <>
                {relatorio.map((item, index) => (
                  <tr key={index} className="border-t">
                    {colunas.map((col) => (
                      <td key={col.chave} className="px-4 py-3">
                        {col.formatador
                          ? col.formatador(item[col.chave])
                          : item[col.chave]}
                      </td>
                    ))}
                  </tr>
                ))}
                {mostrarTotal && (
                  <tr className="text-brown-dark border-t font-semibold">
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3" colSpan={colunas.length - 2}>
                      {renderTotal
                        ? renderTotal(relatorio)
                        : campoTotal
                          ? prefixoMoeda
                            ? `R$ ${total.toFixed(2)}`
                            : total
                          : null}
                    </td>
                    <td className="px-4 py-3">100%</td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {renderExtra && relatorio.length > 0 && (
        <div className="mt-8">{renderExtra(relatorio)}</div>
      )}
    </div>
  );
};

export default RelatorioBase;
