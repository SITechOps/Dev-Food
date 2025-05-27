import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { showWarning } from "@/shared/components/ui/AlertasPersonalizados/toastAlerta";

export const useCarrinho = () => {
  const [dados, setDados] = useState<any>([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const subtotal = dados.reduce(
    (sum: any, item: any) => sum + item.subtotal,
    0,
  );
  const [taxa_entrega, setTaxaEntrega] = useState(0);
  const storedCarrinho = localStorage.getItem("carrinho");
  const [distancia, setDistancia] = useState<number | null>(null);
  const [tempoEntrega, setTempoEntrega] = useState<number | null>(null);
  const [restauranteId, setRestauranteId] = useState<string | null>(null);
  const resSelecionado = localStorage.getItem("restauranteSelecionado");
  const taxaEntregaRestaurante = resSelecionado
    ? JSON.parse(resSelecionado).taxa_entrega
    : 0;

  useEffect(() => {
    setTaxaEntrega(taxaEntregaRestaurante);
    if (storedCarrinho) {
      const carrinho = JSON.parse(storedCarrinho);

      if (Array.isArray(carrinho) && carrinho.length > 0) {
        const carrinhoAgrupado = Object.values(
          carrinho.reduce((acc: any, item: any) => {
            if (!acc[item.id]) {
              acc[item.id] = { ...item };
            } else {
              acc[item.id].quantidade += item.quantidade;
              acc[item.id].subtotal += item.subtotal;
            }
            return acc;
          }, {}),
        );

        setDados(carrinhoAgrupado);
      }
    } else {
      console.log("Carrinho não encontrado no localStorage.");
    }
  }, []);

  useEffect(() => {
    if (dados.length > 0) {
      const compra = {
        itens: dados,
        subtotal,
        taxa_entrega,
        distancia,
        tempoEntrega,
        restauranteId: dados[0].restauranteId,
      };

      localStorage.setItem("compraAtual", JSON.stringify(compra));
      localStorage.setItem("carrinho", JSON.stringify(dados));
    } else {
      localStorage.removeItem("compraAtual");
      localStorage.removeItem("carrinho");
    }
  }, [dados, subtotal, taxa_entrega]);

  function incrementar(id: number) {
    setDados((prevDados: any) =>
      prevDados.map((item: any) => {
        if (item.id === id) {
          if (item.quantidade < item.qtd_estoque) {
            return {
              ...item,
              quantidade: item.quantidade + 1,
              subtotal: item.subtotal + parseFloat(item.valor_unitario),
            };
          } else {
            showWarning("Limite de estoque atingido para este produto.");
            return item;
          }
        }
        return item;
      })
    );
  }

  function decrementar(id: number) {
    setDados((prevDados: any) =>
      prevDados.map((item: any) =>
        item.id === id && item.quantidade > 1
          ? {
            ...item,
            quantidade: item.quantidade - 1,
            subtotal: item.subtotal - parseFloat(item.valor_unitario),
          }
          : item,
      ),
    );
  }

  function removerItem(id: string) {
    const novoCarrinho = dados.filter((item: any) => item.id !== id);
    setDados(novoCarrinho);
    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
  }

  function escolherFormaPagamento(
    setIsCarrinhoOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    if (!isAuthenticated) {
      showWarning(
        "Verificamos que você não está logado. Por favor, faça login para continuar.",
      );
      setIsCarrinhoOpen(false);
      navigate("/auth");
      return;
    } else {
      setIsCarrinhoOpen(false);
      navigate("/pagamento");
    }
  }

  return {
    navigate,
    dados,
    incrementar,
    decrementar,
    removerItem,
    subtotal,
    taxa_entrega,
    distancia,
    tempoEntrega,
    restauranteId,
    setDados,
    escolherFormaPagamento,
  };
};
