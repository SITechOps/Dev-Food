import { api } from "@/connection/axios";
import { useEffect, useState } from "react";
import { IPagePix, IResponsePagePix } from "@/interface/IPagamento";
import { usePagamento } from "./usePagamento";

export const usePixComponent = () => {
	const [key, setKey] = useState(0);
	const [copied, setCopied] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const { valoresCarrinho, userData, postPedido, setLoading } = usePagamento();
	const [statusPagamento, setStatusPagamento] = useState(false);
	const [eventStaus, setEventStatus] = useState<"andamento" | "concluido">("andamento");
	const [tempoDeProcessamento, setTempoDeProcessamento] = useState<"andamento" | "expirou">("andamento");
	const [respPagamento, setRespPagamento] = useState<IResponsePagePix>({
		id: "",
		qr_code: "",
		qr_code_base64: "",
	  });
	  

	useEffect(() => {
		if (!userData?.sub || valoresCarrinho.total === 0) return;
	
		(async () => {
			try {
				const { data } = await api.get(`/user/${userData?.sub}`);
				const dados = data?.data?.attributes || [];
	
				const pixPayload: IPagePix = {
					email_comprador: dados.email,
					nome_comprador: dados.nome,
					valor_pagamento: 0.15,
				};
		
				const response = await api.post<IResponsePagePix>("/pix/qr-code", {
					pix: pixPayload,
				});
	
				const dadosPix = response.data;
	
				if (dadosPix) {
					setRespPagamento({
						id: dadosPix.id,
						qr_code: dadosPix.qr_code,
						qr_code_base64: dadosPix.qr_code_base64,
					});
					setKey(prevKey => prevKey + 1);
				}
				setLoading(false);
			} catch (error) {
				setLoading(false);
				console.error("Erro ao buscar usuário:", error);
			}
		})();
	}, [userData?.sub, valoresCarrinho.total]);

	// useEffect(() => {
	// 	if (!respPagamento.qr_code_base64) return;
	
	// 	const interval = setInterval(() => {
	// 	  setConometro((prev) => {
	// 		if (prev.timeLeft <= 1) {
	// 		  clearInterval(interval);
	// 		  setTempoDeProcessamento("concluido");
	// 		  setShowModal(false);
	// 		  return { ...prev, timeLeft: 0 }; 
	// 		}
	// 		return { ...prev, timeLeft: prev.timeLeft - 1 }; 
	// 	  });
	// 	}, 1000); 
	
	// 	return () => clearInterval(interval); 
	//   }, [respPagamento.qr_code_base64]);
	
	//   function formatTime(seconds: number) {
	// 	const min = Math.floor(seconds / 60);
	// 	const sec = seconds % 60;
	// 	return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
	//   }

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
		// time,
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
		// conometro, 
		// setConometro,
		respPagamento,
		setRespPagamento,
		stausPagamentoPix,
		// formatTime,
		handleCopy,
		tempoDeProcessamento,
		setTempoDeProcessamento
	};
};
