import { api } from "@/connection/axios";
import { useEffect, useState } from "react";
import { IPagePix, IResponsePagePix, StatusChave, statusTipo } from "@/interface/IPagamento";
import { usePagamento } from "./usePagamento";
import QRCode from 'qrcode';

export const usePixComponent = () => {
	const [key, setKey] = useState(0);
	const [copied, setCopied] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const { valoresCarrinho, userData, setLoading, postPedido, navigate } = usePagamento();
	const [statusPagamento, setStatusPagamento] = useState<StatusChave>("pendente");
	const sequencia: StatusChave[] = ["pendente", "processando", "aprovado"];
	const idGenerico = Math.random().toString(36).substring(2, 10);
	const [respPagamento, setRespPagamento] = useState<IResponsePagePix>({
		id: "",
		qr_code: "",
		qr_code_base64: "",
	});


	useEffect(() => {
		if (!userData?.sub || valoresCarrinho.total === 0) return;

		if (!respPagamento.qr_code || !respPagamento.qr_code_base64) {
			qrCodeMercadoPago();
			processamentoPagamento();
		}
		verificarStatus();

	}, [userData?.sub, valoresCarrinho.total, statusPagamento]);


	function processamentoPagamento() {
		let index = 0;

		const interval = setInterval(() => {
			if (index < sequencia.length - 1) {
				index++;
				setStatusPagamento(sequencia[index]);
			} else {
				clearInterval(interval);
			}
		}, 10000);
		return () => clearInterval(interval);
	}

	async function verificarStatus() {
		if (statusPagamento === "aprovado") {
			setShowModal(true);
		}
	};

	async function acompanharPedido() {
		await postPedido();
		navigate("/historico")
	};

	async function qrCodeGenerico(valor: string) {
		try {
			const resp = await QRCode.toDataURL(valor);

			if (resp) {
				setRespPagamento({
					id: idGenerico,
					qr_code: resp.replace(/^data:image\/[a-zA-Z]+;base64,/, ''),
					qr_code_base64: resp,
				});
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
					await stausPagamentoPix()
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
			// setStatusPagamento(status);

		} catch (error) {
			console.error("Erro ao verificar status do pagamento:", error);
		}
	}

	return {
		key,
		userData,
		statusTipo,
		valoresCarrinho,
		copied,
		setCopied,
		setLoading,
		showModal,
		setShowModal,
		statusPagamento,
		setStatusPagamento,
		acompanharPedido,
		respPagamento,
		setRespPagamento,
		handleCopy,
	};
};
