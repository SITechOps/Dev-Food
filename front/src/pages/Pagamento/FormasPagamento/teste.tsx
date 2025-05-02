import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/connection/axios";
import { usePagamento } from "@/hooks/Pagamento/usePagamento";
import { ICreatFormCartao, ITokenCartao } from "@/interface/IPagamento";
import { useEffect, useRef, useState } from "react";
import CardsOpcoes from "../components/CardsOpcoes";
import { FaCcMastercard } from "react-icons/fa";
import Modal from "@/components/ui/Modal";

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
	const [formKey, setFormKey] = useState<number>(Date.now());
	const { valoresCarrinho, getDadosUser } = usePagamento();
	const [showModal, setShowModal] = useState(false);
	const [etapa, setEtapa] = useState<"incial" | "novoCartao">("incial");

	useEffect(() => {
		if (showModal) {
			emissaoCartaoMercadoPago();
		}
	  }, [showModal]);

	function emissaoCartaoMercadoPago() {
		if (!window.MercadoPago) {
			console.error("SDK do Mercado Pago não carregado.");
			return;
		}

		if (cardFormRef.current) {
			console.warn("CardForm já foi montado, evitando recriação.");
			return;
		}

		mpInstance = new window.MercadoPago("APP_USR-f987084c-b5e3-4a41-b459-556ca6dcbbb4", {
			locale: "pt-BR",
		});

		cardFormInstanceRef.current = mpInstance.cardForm({
			amount: valoresCarrinho.total.toString(2),
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
	}


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



	async function postCartao(dados: ICreatFormCartao) {
		try {
			const respUser = await getDadosUser();
			const email = respUser.email

			const payload = {
				token: dados.token,
				cardholderEmail: email,
				transaction_amount: dados.amount,
				installments: dados.installments, // parcela
				identification_type: dados.identificationType,
				identification_number: dados.identificationNumber,
				payment_method_id: dados.paymentMethodId ,
			}
			console.log(payload)

			const response = await api.post<ITokenCartao>("/cartao", { payload });
			console.log("Pagamento realizado com sucesso:", response.data);
			alert("Pagamento aprovado!");

			console.log("Pagamento realizado com sucesso:", response.data);
		} catch (error) {
			console.error("Erro ao processar pagamento:", error);
		}
	} 

	function adicionarCartao() {
		cardFormRef.current = false;
		setShowModal(true)
		setFormKey(Date.now());
	}

	return (
		<>
			<p className="my-4 font-bold">Cartões Cadastrados:</p>
			<CardsOpcoes
				icon={<FaCcMastercard />}
				title="Maria - Mastercard"
				subtitle="**** 2546"
				onClick={() => console.log("um cartão")}
			/>
			<hr className="my-5" />
			<Button className="p-2" onClick={adicionarCartao}>Adicionar novo Cartão</Button>
			{/* aplicar um scroll em casop de tela pequena */}
			<Modal isOpen={showModal} onClose={() => setShowModal(false)} className="w-100"> 

				<div key={formKey}>
					<form id="form-checkout" onSubmit={handleSubmit}> 
					
						<Input
							textLabel="Número do cartão"
							id="form-checkout__cardNumber"
							type="text"
							className="mb-3"
						/>

						<div className="flex items-center gap-4">

							<Input
								textLabel="Validade"
								id="form-checkout__expirationDate"
								type="text"
								className="mb-3"
							/>

							<Input
								textLabel="CVV"
								id="form-checkout__securityCode"
								type="text"
								className="mb-3"
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="form-checkout__installments" className="font-medium">Quantidade de Parcelas</label>
							<select className="input" id="form-checkout__installments"></select>
						</div>
						<div className="flex gap-4 mb-3">

							<div>
								<label htmlFor="form-checkout__identificationType" className="font-medium">Tipo de documento</label>
								<select className="input" id="form-checkout__identificationType"></select>
							</div>
							<div>
								<label htmlFor="form-checkout__issuer" className="font-medium">Tipo de Cartão</label>
								<select className="input" id="form-checkout__issuer"></select>
							</div>

						</div>
						<div className="flex gap-4 items-center">
							<Input
								textLabel="Nome impresso no cartão"
								id="form-checkout__cardholderName"
								type="text"
								className="mb-3"
							/>

							<Input
								textLabel="CPF do titular"
								id="form-checkout__identificationNumber"
								type="text"
								className="mb-3"
							/>
						</div>

						<Button type="submit" className="mt-5" disabled={!isCardFormReady}>Pagar</Button>
					</form>
				</div>
			</Modal>
		</>
	)
}