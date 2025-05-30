import { api } from "@/connection/axios";
import { useEffect, useState } from "react";
import { IPagePix, IResponsePagePix, StatusChave, statusTipo } from "@/interface/IPagamento";
import { usePagamento } from "./usePagamento";
import QRCode from 'qrcode';
import { usePagamentoContext } from "@/contexts/PagamaentoContext";

export const usePixComponent = () => {
	const [key, setKey] = useState(0);
	const [copied, setCopied] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const { valoresCarrinho, userData, setIsLoading, isLoading, taxaEntregaSelecionada, storedCompra, postPedido } = usePagamento();
	const [statusPagamento, setStatusPagamento] = useState<StatusChave>("pendente");
	const sequencia: StatusChave[] = ["pendente", "processando", "aprovado"];
	const idGenerico = Math.random().toString(36).substring(2, 10);
	const [respPagamento, setRespPagamento] = useState<IResponsePagePix>({
		id: "",
		qr_code: "",
		qr_code_base64: "",
	});
	const [pagoComMP, setPagoComMP] = useState(false);
	const [loadingMP, setLoadingMP] = useState(false);
	const [loadingGenerico, setLoadingGenerico] = useState(false);
	const [pagamentoIniciado, setPagamentoIniciado] = useState(false);
	const { resetPagamento } = usePagamentoContext();


	useEffect(() => {
		if (!userData?.sub || valoresCarrinho.total === 0) return;
	}, [userData?.sub, valoresCarrinho.total, statusPagamento]);


	async function processamentoPagamento(sequencia: StatusChave[], intervaloMs: number = 10000) {
		for (let index = 0; index < sequencia.length; index++) {
			const novoStatus = sequencia[index];

			setStatusPagamento(novoStatus);

			if (novoStatus === "aprovado") {
				setShowModal(true);
				break;
			}
			await new Promise((resolve) => setTimeout(resolve, intervaloMs));
		}
	}


	async function acompanharPedido() {
		await postPedido("pix");
	};

	async function qrCodeGenerico() {
		setLoadingGenerico(true);

		try {
			const resp = await QRCode.toDataURL(valoresCarrinho.total.toString(2));

			if (resp) {
				setRespPagamento({
					id: idGenerico,
					qr_code: resp.replace(/^data:image\/[a-zA-Z]+;base64,/, ""),
					qr_code_base64: resp,
				});
			}
			processamentoPagamento(sequencia, 8000);
		} catch (error) {
			setTimeout(() => {
				resetPagamento();
			}, 0);
			console.log("erro qrCodeGenerico:", error)
		} finally {
			setLoadingGenerico(false);
		}
	};

	function qrCodeMercadoPago() {
		setLoadingMP(true);

		(async () => {
			try {
				setPagoComMP(true)
				const { data } = await api.get(`/user/${userData?.sub}`);
				const dados = data?.data?.attributes || [];

				if (storedCompra) {
					const compra = JSON.parse(storedCompra);
					const pixPayload: IPagePix = {
						email_comprador: dados.email,
						nome_comprador: dados.nome,
						valor_pagamento: Number((compra.subtotal + taxaEntregaSelecionada).toFixed(2)),
					};

					const response = await api.post<IResponsePagePix>("/pix/qr-code", {
						pix: pixPayload,
					});

					const dadosPix = response.data;

					const qrVazio =
						!dadosPix?.qr_code ||
						!dadosPix?.qr_code_base64 ||
						dadosPix.qr_code.trim() === '' ||
						dadosPix.qr_code_base64.trim() === '';

					if (!qrVazio) {
						setRespPagamento({
							id: dadosPix.id,
							qr_code: dadosPix.qr_code,
							qr_code_base64: `data:image/svg;base64,${dadosPix.qr_code_base64}`,
						});
						setKey(prevKey => prevKey + 1);
					} else {
						alert('Não foi possível gerar o QR Code. Parece que sua chave não está habilitada no Mercado Pago. Por favor, volte e clique em "simular o pagamento".')
					}
				}
			} catch (error) {
				setTimeout(() => {
					resetPagamento();
				}, 0);
				console.log("erro qrCodeMercadoPago:", error)
			} finally {
				setLoadingMP(false);
			}
		})();
	}

	function handleCopy() {
		if (respPagamento.qr_code) {
			navigator.clipboard.writeText(respPagamento.qr_code).then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 3000);
			});
		}
	};

	async function stausPagamentoPix() {
		try {
			const response = await api.get(`/pix/status/${respPagamento.id}`);
			const status = response.data.status;

			switch (status) {
				case "approved":
					setStatusPagamento("aprovado");
					setShowModal(true);
					break;

				case "pending":
					setStatusPagamento("pendente");
					console.log("pedido pendente de pagamento")
					break;

				case "rejected":
					setStatusPagamento("rejeitado");
					alert("Pagamento rejeitado. Por favor, tente novamente.");
					resetPagamento();
					break;

				default:
					resetPagamento();
					console.warn(`Status desconhecido recebido: ${status}`);
					break;
			}

		} catch (error) {
			setTimeout(() => {
				resetPagamento();
			}, 0);
			console.log("erro stausPagamentoPix:", error)
		}
	}

	return {
		key,
		userData,
		statusTipo,
		valoresCarrinho,
		copied,
		setCopied,
		setIsLoading,
		isLoading,
		showModal,
		setShowModal,
		statusPagamento,
		setStatusPagamento,
		acompanharPedido,
		respPagamento,
		setRespPagamento,
		handleCopy,
		qrCodeGenerico,
		loadingGenerico,
		qrCodeMercadoPago,
		loadingMP,
		pagamentoIniciado,
		setPagamentoIniciado,
		pagoComMP,
		setPagoComMP,
		stausPagamentoPix

	};
};
