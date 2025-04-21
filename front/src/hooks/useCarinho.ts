import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const useCarrinho = () => {
	const [dados, setDados] = useState<any>([]);
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const subtotal = dados.reduce((sum: any, item: any) => sum + item.subtotal, 0);
	const taxaEntrega = 5.0; // aplicar a logica para calcular a taxa de entrega
	const total = subtotal + taxaEntrega;
	const storedCarrinho = localStorage.getItem("carrinho");

	useEffect(() => {
	
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
					}, {})
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
				taxaEntrega,
				total,
			};
	
			localStorage.setItem("compraAtual", JSON.stringify(compra));
			localStorage.setItem("carrinho", JSON.stringify(dados));
		}
	}, [dados, subtotal, taxaEntrega, total]);
	

	function incrementar(id: number) {
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

	function decrementar(id: number) {
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

	function removerItem(id: string) {
		const novoCarrinho = dados.filter((item: any) => item.id !== id);
		setDados(novoCarrinho);
		localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
	};


	function escolherFormaPagamento(setIsCarrinhoOpen: React.Dispatch<React.SetStateAction<boolean>>) {
		if (!isAuthenticated) {
			alert("Verificamos que você não está logado. Por favor, faça login para continuar.");
			setIsCarrinhoOpen(false)
			navigate("/auth");
			return;
		} else {
			console.log("navegando para /pagamento");
			setIsCarrinhoOpen(false);
			navigate("/pagamento");
		}
	};

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
		escolherFormaPagamento,
	};
}