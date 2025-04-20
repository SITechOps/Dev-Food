import { useEffect, useState } from "react";

export const usePagamento = () => {
	const [selecionado, setSelecionado] = useState<"site" | "entrega">("site");
	const styleOptions = "text-left hover:bg-brown-light hover:text-brown-normal text-blue cursor-pointer flex gap-6 items-center mb-5 border border-gray-medium hover:border-brown-light-active rounded-sm p-3 w-[25rem]";
	const endereco = {
		ruaENumero: "Rua das Laranjeiras, 123",
		complemento: "Apto 45, Bloco B - São Paulo - SP"
	}
	const [etapa, setEtapa] = useState<"opcaoPagamento" | "pagePix" | "pageCartao">("opcaoPagamento");
	const [restaurante, setRestaurante] = useState("");
	const [subtotal, setSubtotal] = useState(0);
	const [taxaEntrega, setTaxaEntrega] = useState(0);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		const storedCompra = localStorage.getItem("compraAtual");
		if (storedCompra) {
			const compra = JSON.parse(storedCompra);
			setRestaurante(compra.itens[0]?.restaurante.nome);
			setSubtotal(compra.subtotal);
			setTaxaEntrega(compra.taxaEntrega);
			setTotal(compra.total);

		} else {
			// console.log("Carrinho não encontrado no localStorage.");
		}
	})
			
	return{
		restaurante,
		subtotal,
		taxaEntrega,
		total,
		selecionado,
		setSelecionado,
		styleOptions,
		endereco,
		etapa,
		setEtapa
	}
}