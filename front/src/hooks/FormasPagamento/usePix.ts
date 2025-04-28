import { api } from "@/connection/axios";
import { useEffect, useState } from "react";
import { usePagamento } from "../usePagamento";
import { useAuth } from "@/contexts/AuthContext";
import { IPagePix } from "@/interface/IPagePix";

export const usePixComponent = () => {
	const { userData } = useAuth();
	const [key, setKey] = useState(0);
	const [copied, setCopied] = useState(false);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const { valoresCarrinho, setEtapa } = usePagamento();
	const [statusPagamento, setStatusPagamento] = useState(false);
	const [eventStaus, setEventStatus] = useState<"andamento" | "concluido">("andamento");
	const [tempoDeProcessamento, setTempoDeProcessamento] = useState<"andamento" | "concluido">("andamento");
	const [conometro, setConometro] = useState({
		totalTime: 10 * 60,
		timeLeft: 10 * 60,
	});
	const time = (conometro.timeLeft / conometro.totalTime) * 100;
	const [respPagamento, setRespPagamento] = useState({
		id: "",
		qrCode: "",
		pixCode: "",
	})

	useEffect(() => {
		if (!userData?.sub || valoresCarrinho.total === 0) return;
	
		(async () => {
			try {
				const { data } = await api.get(`/user/${userData.sub}`);
				const dados = data?.data?.attributes || [];
	
				const pixPayload = {
					email_comprador: dados.email,
					nome_comprador: dados.nome,
					valor_pagamento: 0.15,
				};
		
				const response = await api.post<IPagePix>("/pix/qr-code", {
					pix: pixPayload,
				});
	
				const dadosPix = response.data;
	
				if (dadosPix) {
					setRespPagamento({
						id: dadosPix.id,
						qrCode: dadosPix.qr_code_base64,
						pixCode: dadosPix.qr_code,
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

	useEffect(() => {
		if (!respPagamento.qrCode) return;
	
		const interval = setInterval(() => {
		  setConometro((prev) => {
			if (prev.timeLeft <= 1) {
			  clearInterval(interval);
			  setTempoDeProcessamento("concluido");
			  setShowModal(false);
			  return { ...prev, timeLeft: 0 }; 
			}
			return { ...prev, timeLeft: prev.timeLeft - 1 }; 
		  });
		}, 1000); 
	
		return () => clearInterval(interval); 
	  }, [respPagamento.qrCode]);
	
	  function formatTime(seconds: number) {
		const min = Math.floor(seconds / 60);
		const sec = seconds % 60;
		return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
	  }

	function handleCopy() {
		if (respPagamento.pixCode) {
			navigator.clipboard.writeText(respPagamento.pixCode).then(() => {
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
					break;
				case "expired":
				case "rejected":
					setTempoDeProcessamento("concluido");
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
		time,
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
		conometro, 
		setConometro,
		respPagamento,
		setRespPagamento,
		stausPagamentoPix,
		formatTime,
		handleCopy,
		tempoDeProcessamento,
		setTempoDeProcessamento
	};
};
