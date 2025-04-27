import { useEffect, useState } from "react";

export const usePagamento = () => {
	const styleOptions = "text-left hover:bg-brown-light hover:text-brown-normal text-blue cursor-pointer flex gap-6 items-center mb-5 border border-gray-medium hover:border-brown-light-active rounded-sm p-3 w-[25rem]";
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
		styleOptions,
		endereco,
		etapa,
		setEtapa,
		modeloPagamento, 
		setModeloPagamento,
	}
}