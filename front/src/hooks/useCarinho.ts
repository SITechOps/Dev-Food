import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useCarrinho = () => {
const [dados, setDados] = useState<any>([]);
const navigate = useNavigate();

	useEffect(() => {
		const storedCarrinho = localStorage.getItem("carrinho");

		if (storedCarrinho) {
			const carrinho = JSON.parse(storedCarrinho);

			if (Array.isArray(carrinho) && carrinho.length > 0) {
				console.log("Carrinho recuperado:", carrinho);

				const carrinhoAgrupado = Object.values(
					carrinho.reduce((acc: any, item: any) => {
						if (!acc[item.id]) {
							acc[item.id] = { ...item }; 
						} else {
							acc[item.id].quantidade += item.quantidade; 
							acc[item.id].subtotal += item.subtotal; 
						}
						return acc;
					}, {})
				);

				setDados(carrinhoAgrupado); 
			} else {
				console.log("Carrinho vazio ou inválido.");
			}
		} else {
			console.log("Carrinho não encontrado no localStorage.");
		}
	}, []);

	const incrementar = (id: number) => {
		setDados((prevDados: any) =>
			prevDados.map((item: any) =>
				item.id === id
					? {
						...item,
						quantidade: item.quantidade + 1,
						subtotal: item.subtotal + item.valor_unitario,
					}
					: item
			)
		);
	};

	const decrementar = (id: number) => {
		setDados((prevDados: any) =>
			prevDados.map((item: any) =>
				item.id === id && item.quantidade > 1
					? {
						...item,
						quantidade: item.quantidade - 1,
						subtotal: item.subtotal - item.valor_unitario,
					}
					: item
			)
		);
	};

	const removerItem = (id: string) => {
		const novoCarrinho = dados.filter((item: any) => item.id !== id);
		setDados(novoCarrinho);
		localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
	};

	useEffect(() => {
		localStorage.setItem("carrinho", JSON.stringify(dados));
	}, [dados]);		

	const subtotal = dados.reduce((sum: any, item: any) => sum + item.subtotal, 0);
	const taxaEntrega = 5.0; // aplicar a logica para calcular a taxa de entrega
	const total = subtotal + taxaEntrega;

	return {
		navigate,
		dados,
		incrementar,
		decrementar,
		removerItem,
		subtotal,
		taxaEntrega,
		total,
		setDados, 
	};
}