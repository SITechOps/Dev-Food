import { api } from "@/connection/axios";
import { useAuth } from "@/contexts/AuthContext";
import { CarrinhoContext } from "@/contexts/CarrinhoContext";
import { IItens, IPedido } from "@/interface/IPagamento";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const usePagamento = () => {
	const { userData,  token } = useAuth();
	const [endereco, setEndereco] = useState("");
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const { quantidadeTotal, atualizarQuantidadeTotal } = useContext(CarrinhoContext);
	const [selecionado, setSelecionado] = useState<"site" | "entrega">("site");
	const [etapa, setEtapa] = useState<"opcaoPagamento" | "pagePix" | "pageCartao">("opcaoPagamento");
	const [modeloPagamento, setModeloPagamento] = useState<"site" | "entrega">("site");
	const [restaurante, setRestaurante] = useState("");
	const storedCompra = localStorage.getItem("compraAtual");
	const [valoresCarrinho, setValoresCarrinho] = useState({
		subtotal: 0,
		taxaEntrega: 0,
		total: 0
	});
	const idUsuario = userData?.sub;

	//pegar o endereço do cliente
	useEffect(() => {
		async function obterEnderecoCliente() {
		  try {
			if (!idUsuario || !token) {
			  return;
			}
	
			const response = await api.get(`/user/${idUsuario}/enderecos`, {
			  headers: {
				Authorization: `Bearer ${token}`,
			  },
			});
			const endereco = response.data?.data?.attributes[0];
	
			if (!endereco) {
			  return;
			}
	
			const enderecoCompleto = `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}, ${endereco.pais}`;
	
			setEndereco(enderecoCompleto);
	
		  } catch (error) {
			console.error(
			  error,
			);
		  }
		}
	
		obterEnderecoCliente();
	}, [idUsuario, token]);

	useEffect(() => {
		if (storedCompra) {
			const compra = JSON.parse(storedCompra);
			setRestaurante(compra.itens[0]?.restaurante.nome);
			setValoresCarrinho({
				subtotal: compra.subtotal,
				taxaEntrega: compra.taxaEntrega,
				total: compra.total,
			});
		} else {
			// console.log("Carrinho não encontrado no localStorage.");
		}
	}, [valoresCarrinho.total]);

	//console.log("storedCompra",storedCompra)

	async function postPedido() {
		try {
			if (storedCompra) {
				const compra = JSON.parse(storedCompra);
				console.log(compra.itens[0]?.restaurante.id)

				const pedidoPayload: IPedido = {
					id_usuario: userData?.sub,
					id_restaurante: compra.itens[0]?.restaurante.id,
					id_endereco: endereco.id,
					valor_total: compra.total,
					forma_pagamento: "pix",
					itens: compra.itens.map((item: any): IItens => ({
						id_produto: item.id,
						qtd_itens: item.quantidade,
						valor_calculado: item.subtotal
					}))
				};

				console.log("pedido", pedidoPayload)
				const resp = await api.post("/pedido", { pedido: pedidoPayload });
				if (resp.status === 201) {
					setLoading(false);
					localStorage.removeItem('quantidadeTotal');
					localStorage.removeItem('compraAtual');
					localStorage.removeItem('carrinho');
					atualizarQuantidadeTotal();
				}
				console.log("pedido", resp)
			}
		} catch (error) {
			console.error("Erro ao verificar status do pagamento:", error);
		}
	}

	return {
		userData,
		navigate,
		restaurante,
		valoresCarrinho,
		setLoading,
		setValoresCarrinho,
		selecionado,
		setSelecionado,
		endereco,
		etapa,
		setEtapa,
		modeloPagamento,
		setModeloPagamento,
		postPedido,
	}
}