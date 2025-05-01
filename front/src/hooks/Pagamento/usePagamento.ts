import { api } from "@/connection/axios";
import { useAuth } from "@/contexts/AuthContext";
import { CarrinhoContext } from "@/contexts/CarrinhoContext";
import { IEndereco, IResponseEndereco } from "@/interface/IEndereco";
import { IItens, IPedido } from "@/interface/IPagamento";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const usePagamento = () => {
	const { userData } = useAuth();
	const navigate = useNavigate();
	const [endereco, setEndereco] = useState<IEndereco[] | null>(null);
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

	useEffect(() => {
		const fetchData = async () => {
		  if (storedCompra) {
			const compra = JSON.parse(storedCompra);
			setRestaurante(compra.itens[0]?.restaurante.nome);
			setValoresCarrinho({
			  subtotal: compra.subtotal,
			  taxaEntrega: compra.taxaEntrega,
			  total: compra.total,
			});
	  
			await getEndereco(); 
		  } else {
			// console.log("Carrinho não encontrado no localStorage.");
		  }
		};
	  
		fetchData(); 
	  }, [storedCompra]); 
	  
	async function getEndereco() {
		try {
			const resp = await api.get<{ data: IResponseEndereco }>(`/user/${userData?.sub}/enderecos`);
			const attributes = resp.data.data.attributes 
			setEndereco(attributes);
			console.log("id  endereco",attributes[0].id);
		} catch (error) {
			console.error("Erro ao buscar endereço:", error);
		}
	}

	async function postPedido() {
		try {
			if (storedCompra) {
				const compra = JSON.parse(storedCompra);
				const idEndereco = endereco && endereco.length > 0 ? endereco[0].id : "";
				if (!idEndereco) {
				  console.error("Endereço não encontrado.");
				  return;
				}

				const pedidoPayload: IPedido = {
					id_usuario: userData?.sub,
					id_restaurante: compra.itens[0]?.restaurante.id,
					id_endereco: idEndereco, 
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
				alert('seu pedido foi gerado com sucesso')
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