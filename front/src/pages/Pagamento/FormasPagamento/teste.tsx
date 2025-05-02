import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/connection/axios";
import { usePagamento } from "@/hooks/Pagamento/usePagamento";
import { ITokenCartao } from "@/interface/IPagamento";
import { useEffect, useRef, useState } from "react";

export { };

declare global {
	interface Window {
		MercadoPago: any;
	}
}

let mpInstance: any = null;


export default function TesteCartao() {
	const cardFormRef = useRef<boolean>(false);
	const [isCardFormReady, setIsCardFormReady] = useState<boolean>(false);
	const cardFormInstanceRef = useRef<any>(null);
	const { valoresCarrinho, getDadosUser } = usePagamento();

	useEffect(() => {

		if (!window.MercadoPago) {
			console.error("SDK do Mercado Pago não carregado.");
			return;
		}

		if (!window.MercadoPago || cardFormRef.current) {
			return;
		}

		mpInstance = new window.MercadoPago("APP_USR-f987084c-b5e3-4a41-b459-556ca6dcbbb4", {
			locale: "pt-BR",
		});


		cardFormInstanceRef.current = mpInstance.cardForm({
			amount: valoresCarrinho.total,
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
					setIsCardFormReady(true);
					console.log("Formulário montado com sucesso");
				}
			}
		});
		cardFormRef.current = true;
	}, []);


	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!isCardFormReady) {
			console.error("O formulário ainda não foi montado.");
			return;
		}

		try {
			const formData = cardFormInstanceRef.current?.getCardFormData?.();
			if (!formData) {
				console.error("Falha ao obter dados do cartão.");
				return;
			}
			console.log("Dados do formulário:", formData);
			await postCartao(formData)
			// Aqui você pode enviar formData.token ao backend
		} catch (error) {
			console.error("Erro ao processar o pagamento:", error);
		}
	}



	async function postCartao(dados: ITokenCartao) {
		try {
			const respUser = await getDadosUser();

			const payload = {
				token: dados.token,
				cardholderEmail: respUser.email,
				transaction_amount: dados.transaction_amount,
				installments: dados.installments, // parcela
				identification_type: dados.identification_type,
				identification_number: dados.identification_number,
				payment_method_id: dados.payment_method_id,
			}

			const response = await api.post<ITokenCartao>("/cartao", { payload });
			console.log("Pagamento realizado com sucesso:", response.data);
			alert("Pagamento aprovado!");

			console.log("Pagamento realizado com sucesso:", response.data);
		} catch (error) {
			console.error("Erro ao processar pagamento:", error);
		}
	}


	return (
		<>
			<form id="form-checkout" onSubmit={handleSubmit}>
				<Input type="text" id="form-checkout__cardholderName" placeholder="Nome no cartão" />
				<Input type="text" id="form-checkout__cardNumber" placeholder="Número do cartão" />
				<Input type="text" id="form-checkout__expirationDate" placeholder="MM/AA" />
				<Input type="text" id="form-checkout__securityCode" placeholder="CVV" />
				<select className="input" id="form-checkout__installments"></select>
				<select className="input" id="form-checkout__identificationType"></select>
				<Input type="text" id="form-checkout__identificationNumber" placeholder="CPF" />
				<select className="input" id="form-checkout__issuer"></select>
				<Button type="submit" disabled={!isCardFormReady}>Pagar</Button>
			</form>
		</>
	)
}