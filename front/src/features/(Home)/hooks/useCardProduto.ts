import {
  showSuccess,
  showWarning,
} from "@/shared/components/ui/AlertasPersonalizados/toastAlerta";
import { CarrinhoContext } from "@/shared/contexts/CarrinhoContext";
import { IProduto } from "@/shared/interfaces/IProduto";
import { IRestaurante } from "@/shared/interfaces/IRestaurante";
import { useContext, useState } from "react";

export function useCardProdutos(produto: IProduto, restaurante: IRestaurante) {
  const [quantidade, setQuantidade] = useState(0);
  const { atualizarQuantidadeTotal } = useContext(CarrinhoContext);
  const incrementar = () => setQuantidade((q) => q + 1);
  const decrementar = () => setQuantidade((q) => (q > 0 ? q - 1 : 0));

  async function adicionarAoCarrinho() {
    const addItem = {
      ...produto,
      quantidade,
      subtotal: produto.valor_unitario * quantidade,
      restaurante,
    };

    const storedCarrinho = localStorage.getItem("carrinho");
    let carrinho = storedCarrinho ? JSON.parse(storedCarrinho) : [];

    if (carrinho.length > 0) {
      const cnpjNoCarrinho = carrinho[0].restaurante.cnpj;

      if (cnpjNoCarrinho !== restaurante?.cnpj) {
        showWarning(
          "Opa! Já existe um pedido de outro restaurante. Finalize ou limpe o carrinho para adicionar novos itens.",
        );
        return;
      }
    }

    const itemIndex = carrinho.findIndex((item: any) => item.id === addItem.id);

    if (itemIndex !== -1) {
      const itemExistente = carrinho[itemIndex];

      if (itemExistente.quantidade === addItem.quantidade) {
        return showWarning(
          "A quantidade permanece a mesma, nenhuma alteração feita.",
        );
      }

      const novaQuantidade = addItem.quantidade;
      const diferenca = novaQuantidade - itemExistente.quantidade;

      itemExistente.quantidade = novaQuantidade;
      itemExistente.subtotal += diferenca * itemExistente.valor_unitario;
    } else {
      carrinho.push(addItem);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarQuantidadeTotal();
    setQuantidade(0);
    showSuccess("Produto adicionado ao carrinho!");
  }

  return {
    quantidade,
    incrementar,
    decrementar,
    adicionarAoCarrinho,
  };
}
