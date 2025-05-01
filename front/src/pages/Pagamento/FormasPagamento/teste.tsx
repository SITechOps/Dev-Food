import Button from "@/components/ui/Button";
import { useEffect, useRef } from "react";

export { };

declare global {
	interface Window {
		MercadoPago: any;
	}
}

let mpInstance: any = null;


export default function TesteCartao() {
	const cardFormRef = useRef<boolean>(false);

	useEffect(() => {
		if (cardFormRef.current) return;

		mpInstance = new window.MercadoPago("APP_USR-f987084c-b5e3-4a41-b459-556ca6dcbbb4", {
			locale: "pt-BR",
		});

		mpInstance.cardForm({
			amount: "100.00",
			autoMount: true,
			form: {
				id: "form-checkout",
				cardholderName: { id: "form-checkout__cardholderName" },
				cardNumber: { id: "form-checkout__cardNumber" },
				expirationDate: { id: "form-checkout__expirationDate" },
				securityCode: { id: "form-checkout__securityCode" },
				installments: { id: "form-checkout__installments" },
				identificationType: { id: "form-checkout__identificationType" },
				identificationNumber: { id: "form-checkout__identificationNumber" },
				issuer: { id: "form-checkout__issuer" },
			},
			callbacks: {
				onFormMounted: () => {
					console.log("Formulário montado com sucesso");
				},
			},
		});

		cardFormRef.current = true;
	}, []);

	function cadastrarCartao(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!mpInstance) {
			console.error("MercadoPago ainda não carregado.");
			return;
		}

		const formData = mpInstance.cardForm().getCardFormData();
		console.log("Dados do formulário:", formData);
	}	
	
	return (
		<>
			<form id="form-checkout" onSubmit={cadastrarCartao}>
				<input type="text" id="form-checkout__cardholderName" placeholder="Nome no cartão" />
				<input type="text" id="form-checkout__cardNumber" placeholder="Número do cartão" />
				<input type="text" id="form-checkout__expirationDate" placeholder="MM/AA" />
				<input type="text" id="form-checkout__securityCode" placeholder="CVV" />
				<select id="form-checkout__installments"></select>
				<select id="form-checkout__identificationType"></select>
				<input type="text" id="form-checkout__identificationNumber" placeholder="CPF" />
				<select id="form-checkout__issuer"></select>
				<Button type="submit">Pagar</Button>
			</form>
		</>
	)

}