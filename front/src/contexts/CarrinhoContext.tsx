import { createContext, useEffect, useState, ReactNode } from "react";

interface CarrinhoContextType {
  quantidadeTotal: number;
  atualizarQuantidadeTotal: () => void;
}

export const CarrinhoContext = createContext<CarrinhoContextType>({
  quantidadeTotal: 0,
  atualizarQuantidadeTotal: () => {},
});

export const CarrinhoProvider = ({ children }: { children: ReactNode }) => {
  const [quantidadeTotal, setQuantidadeTotal] = useState(0);

  const atualizarQuantidadeTotal = () => {
    const stored = localStorage.getItem("carrinho");
    if (stored) {
      const carrinho = JSON.parse(stored);
      const total = carrinho.reduce(
        (sum: number, item: any) => sum + item.quantidade,
        0
      );
      setQuantidadeTotal(total);
      localStorage.setItem("quantidadeTotal", total.toString());
    } else {
      setQuantidadeTotal(0);
      localStorage.setItem("quantidadeTotal", "0");
    }
  };

  useEffect(() => {
    atualizarQuantidadeTotal();
  }, []);

  return (
    <CarrinhoContext.Provider value={{ quantidadeTotal, atualizarQuantidadeTotal }}>
      {children}
    </CarrinhoContext.Provider>
  );
};
