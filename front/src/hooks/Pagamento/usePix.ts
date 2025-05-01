import { api } from "@/connection/axios";
import { useEffect, useState } from "react";
import { IPagePix, IResponsePagePix } from "@/interface/IPagamento";
import { usePagamento } from "./usePagamento";
import QRCode from 'qrcode';

export const usePixComponent = () => {
	const [key, setKey] = useState(0);
	const [copied, setCopied] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const { valoresCarrinho, userData, postPedido, setLoading } = usePagamento();
	const [statusPagamento, setStatusPagamento] = useState(false);
	const [eventStaus, setEventStatus] = useState<"andamento" | "concluido">("andamento");
	const [tempoDeProcessamento, setTempoDeProcessamento] = useState<"andamento" | "expirou">("andamento");
	const idGenerico = Math.random().toString(36).substring(2, 10);
	const [respPagamento, setRespPagamento] = useState<IResponsePagePix>({
		id: "",
		qr_code: "",
		qr_code_base64: "",
	});


	useEffect(() => {
		if (!userData?.sub || valoresCarrinho.total === 0) return;
		qrCodeMercadoPago();

	}, [userData?.sub, valoresCarrinho.total]);


	async function qrCodeGenerico(valor: string) {
		console.log("cheuguei aqui")
		try {
			const resp = await QRCode.toDataURL(valor);
			console.log("cheguei aqui", resp);

			if (resp) {
				setRespPagamento({
					id: idGenerico,
					qr_code: resp.replace(/^data:image\/[a-zA-Z]+;base64,/, ''),
					qr_code_base64: resp,
				});
				// setKey(prevKey => prevKey + 1);
			}
			setLoading(false);

		} catch (err) {
			console.error('Erro ao gerar QR Code:', err);
		}
	}

	function qrCodeMercadoPago() {
		(async () => {
			try {
				const { data } = await api.get(`/user/${userData?.sub}`);
				const dados = data?.data?.attributes || [];

				const pixPayload: IPagePix = {
					email_comprador: dados.email,
					nome_comprador: dados.nome,
					valor_pagamento: 0.35,
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
					// qr_code_base64: dadosPix.qr_code_base64 `data:image/svg;base64,${dadosPix.qr_code_base64}`,
				} else {
					qrCodeGenerico(valoresCarrinho.total.toString(2))
				}
				setLoading(false);
			} catch (error) {
				setLoading(false);
				console.error("Erro ao buscar usuário:", error);
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
			console.log(status);

			setShowModal(true);
			setStatusPagamento(status);

			switch (status) {
				case "approved":
					setEventStatus("concluido");
					await postPedido();
					break;
				case "expired":
				case "rejected":
					setTempoDeProcessamento("expirou");
					break;
				default:
					setEventStatus("andamento");
					break;
			}
		} catch (error) {
			console.error("Erro ao verificar status do pagamento:", error);
		}
	}

	return {
		key,
		userData,
		valoresCarrinho,
		copied,
		setCopied,
		setLoading,
		showModal,
		setShowModal,
		statusPagamento,
		setStatusPagamento,
		eventStaus,
		setEventStatus,
		respPagamento,
		setRespPagamento,
		stausPagamentoPix,
		handleCopy,
		tempoDeProcessamento,
		setTempoDeProcessamento
	};
};
