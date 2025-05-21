import { createContext, useContext, useState, ReactNode } from "react";

type ModeloPagamento = "site" | "entrega";
type EtapaPagamento = "opcaoPagamento" | "pagePix" | "pageCartao";

interface PagamentoContextData {
  modeloPagamento: ModeloPagamento;
  setModeloPagamento: (value: ModeloPagamento) => void;
  etapa: EtapaPagamento;
  setEtapa: (value: EtapaPagamento) => void;
  resetPagamento: () => void;
}

const PagamentoContext = createContext<PagamentoContextData | undefined>(undefined);

export const PagamentoProvider = ({ children }: { children: ReactNode }) => {
  const [modeloPagamento, setModeloPagamento] = useState<ModeloPagamento>("site");
  const [etapa, setEtapa] = useState<EtapaPagamento>("opcaoPagamento");

  const resetPagamento = () => {
    setModeloPagamento("site");
    setEtapa("opcaoPagamento");
  };

  return (
    <PagamentoContext.Provider
      value={{ modeloPagamento, setModeloPagamento, etapa, setEtapa, resetPagamento }}
    >
      {children}
    </PagamentoContext.Provider>
  );
};

export const usePagamentoContext = () => {
  const context = useContext(PagamentoContext);
  if (!context) {
    throw new Error("usePagamentoContext deve ser usado dentro de PagamentoProvider");
  }
  return context;
};
