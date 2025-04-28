import { useEffect, useState } from "react";

export const usePagamento = () => {
	const endereco = {
		ruaENumero: "Rua das Laranjeiras, 123",
		complemento: "Apto 45, Bloco B - São Paulo - SP"
	}
	const [selecionado, setSelecionado] = useState<"site" | "entrega">("site");
	const [etapa, setEtapa] = useState<"opcaoPagamento" | "pagePix" | "pageCartao">("opcaoPagamento");
	const [modeloPagamento, setModeloPagamento] = useState<"site" | "entrega">("site");
	const [restaurante, setRestaurante] = useState("");
	const [valoresCarrinho, setValoresCarrinho] = useState({
		subtotal: 0,
		taxaEntrega: 0,
		total: 0
	  });

	useEffect(() => {
		const storedCompra = localStorage.getItem("compraAtual");
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
	  },  [valoresCarrinho.total]);
	  
	  
			
	return{
		restaurante,
		valoresCarrinho,
		setValoresCarrinho,
		selecionado,
		setSelecionado,
		endereco,
		etapa,
		setEtapa,
		modeloPagamento, 
		setModeloPagamento,
	}
}