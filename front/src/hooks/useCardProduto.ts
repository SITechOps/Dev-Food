import { useContext, useState } from "react";
import { IProduto } from "../interface/IProduct";
import { IRestaurante } from "../interface/IRestaurante";
import { CarrinhoContext } from "../contexts/CarrinhoContext";


export function useCardProdutos(produto: IProduto, restaurante: IRestaurante) {
const [quantidade, setQuantidade] = useState(0);
	const [carrinho, setCarrinho] = useState<any[]>([]);
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

		const itemIndex = carrinho.findIndex((item: any) => item.id === addItem.id);

		if (itemIndex !== -1) {
			const itemExistente = carrinho[itemIndex];

			if (itemExistente.quantidade === addItem.quantidade) {
				console.log("A quantidade não foi alterada, mantendo a mesma.");
				return;
			}

			if (addItem.quantidade > itemExistente.quantidade) {
				const diff = addItem.quantidade - itemExistente.quantidade;
				itemExistente.quantidade = addItem.quantidade;
				itemExistente.subtotal += diff * itemExistente.valor_unitario;
			} else {
				const diff = itemExistente.quantidade - addItem.quantidade;
				itemExistente.quantidade = addItem.quantidade;
				itemExistente.subtotal -= diff * itemExistente.valor_unitario;
			}
		} else {
			carrinho.push(addItem);
		}

		localStorage.setItem("carrinho", JSON.stringify(carrinho));
		setCarrinho(carrinho);
		setQuantidade(0);
		atualizarQuantidadeTotal();
	}

  return {
    quantidade,
    incrementar,
    decrementar,
    adicionarAoCarrinho,
  };
}
