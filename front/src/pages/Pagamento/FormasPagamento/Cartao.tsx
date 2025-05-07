import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CardsOpcoes from "../components/CardsOpcoes";
import { FaCcMastercard } from "react-icons/fa";
import Modal from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";
import { useCartaoComponent } from "@/hooks/Pagamento/useCartao";


export default function PagueCartao() {
	const {
		isCardFormReady,
		formKey,
		showModal,
		setShowModal,
		loadingGenerico,
		adicionarCartao,
		simulacaoGenerica,
		handleSubmit
	} = useCartaoComponent();

	return (
		<>
			<p className="my-4 font-bold">Cartões Cadastrados:</p>
			<CardsOpcoes
				icon={<FaCcMastercard />}
				title="Maria - Mastercard"
				subtitle="**** 2546"
				loading={loadingGenerico && <Loader2 />}
				onClick={simulacaoGenerica}
			/>

			<hr className="my-5" />
			<Button className="p-2" onClick={adicionarCartao}>Adicionar novo Cartão</Button>
			<Modal isOpen={showModal} onClose={() => setShowModal(false)} className="w-100 h-150 overflow-y-auto custom-scroll">
				<p className="font-bold text-center">Aceitamos pagamentos com cartão (débito ou crédito).</p>

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
						<Input
							textLabel="E-mail do Titular"
							id="form-checkout__email"
							type="email"
							className="mb-3"
						/>

						<div className="flex gap-4 items-center">
							<Input
								textLabel="Nome do Titular"
								id="form-checkout__cardholderName"
								type="text"
								className="mb-3"
							/>

							<Input
								textLabel="CPF do Titular"
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