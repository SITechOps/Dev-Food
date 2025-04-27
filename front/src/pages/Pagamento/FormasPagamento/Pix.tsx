import { useEffect } from "react";
import { api } from "@/connection/axios";
import { useAuth } from "@/contexts/AuthContext";
import { usePagamento } from "@/hooks/usePagamento";  // Assumindo que o hook esteja exportado

export default function PagePix() {
	const { userData } = useAuth();
	const { valoresCarrinho } = usePagamento();  // Pega o total do hook usePagamento

	useEffect(() => {
		if (!userData?.sub) return;

		(async () => {
			try {
				const { data } = await api.get(`/user/${userData.sub}`);
				const dados = data?.data?.attributes || [];

				if(valoresCarrinho.total != 0){
					const pixPayload = {
						email_comprador: dados.email,
						nome_comprador: dados.nome,
						valor_pagamento: valoresCarrinho.total, 
					};
	
					console.log("Pix Payload:", pixPayload);
	
					const pix = await api.post("/pix/qr-code", {
						pix: pixPayload
					});
	
					console.log(pix);
				}



			} catch (error) {
				console.error("Erro ao buscar usuário:", error);
			}



		})();
	}, [userData?.sub, valoresCarrinho.total]);

	console.log("Total:", valoresCarrinho.total);  // Aqui você vê o valor do total

	return (
		<div>
			<p>Total a pagar via PIX: {valoresCarrinho.total}</p>
			<p>Construa aqui a página de pagamento via PIX</p>
		</div>
	);
}
