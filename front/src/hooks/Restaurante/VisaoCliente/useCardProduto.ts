import { CarrinhoContext } from "@/contexts/CarrinhoContext";
import { IProduto } from "@/interface/IProduto";
import { IRestaurante } from "@/interface/IRestaurante";
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
				alert("Opa! Já existe um pedido de outro restaurante. Finalize ou limpe o carrinho para adicionar novos itens.");
				return;
			}
		}

		const itemIndex = carrinho.findIndex((item: any) => item.id === addItem.id);

		if (itemIndex !== -1) {
			const itemExistente = carrinho[itemIndex];

			if (itemExistente.quantidade === addItem.quantidade) {
				console.log("A quantidade permanece a mesma. Nenhuma alteração feita.");
				return;
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
	}

	return {
		quantidade,
		incrementar,
		decrementar,
		adicionarAoCarrinho,
	};
}
