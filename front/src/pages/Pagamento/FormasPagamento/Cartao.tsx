import { useState } from "react";
import { FaCcMastercard } from "react-icons/fa";
import CardsOpcoes from "../components/CardsOpcoes";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { NumberFormatValues, PatternFormat } from "react-number-format";
import Input from "@/components/ui/Input";
import IconAction from "@/components/ui/IconAction";
import Tipo from "../components/Tipo";
import { BsCreditCardFill } from "react-icons/bs";

export default function PageCartao() {
	const [showModal, setShowModal] = useState(false);
	const [formList, setFormList] = useState({
		nCartao: "",
		nome: "",
		validade: "",
		cvv: "",
		apelido: "",
		cpf: "",
		tipo: "",
	});
	const [etapa, setEtapa] = useState<"dadosCartao" | "dadosPessoal">("dadosCartao");


	function adicionarCartao() {
		setShowModal(true)
	}

	return (
		<div className="mt-5">
			<CardsOpcoes
				icon={<FaCcMastercard />}
				title="Ifood Refeição"
				subtitle="**** 2546"
				onClick={() => console.log("um cartão")}
			/>
			<Button className="p-2" onClick={adicionarCartao}>Adicionar novo Cartão</Button>

			<Modal isOpen={showModal} onClose={() => setShowModal(false)} >
				<form action="">

					{etapa === "dadosPessoal" && (
						<>
							<IconAction className="mb-2" onClick={() => setEtapa("dadosCartao")} />
						</>
					)}
					<p className="font-bold text-center mb-4">Pagamento com cartão</p>
					{etapa === "dadosCartao" && (
						<>
							<p className="text-center">Selecione o meio de pagamento</p>
							<div className="my-5 flex itens-center justify-center space-x-4">
								<Tipo
									tipo="credito"
									tipoSelecionado={formList.tipo} // variável dinâmica
									onClick={() => setFormList(prev => ({ ...prev, tipo: "credito" }))}
									icon={<BsCreditCardFill className="text-2xl" />}
									descricao="Crédito"
								/>
								<Tipo
									tipo="debito"
									tipoSelecionado={formList.tipo}
									onClick={() => setFormList(prev => ({ ...prev, tipo: "debito" }))}
									icon={<BsCreditCardFill className="text-2xl" />}
									descricao="Débito"
								/>
							</div>
							<hr className="my-3" />
							<label htmlFor="nCartao" className="font-medium">
								Número do cartão
							</label>

							<PatternFormat
								format="####.####.####.####"
								mask="_"
								allowEmptyFormatting
								value={formList.nCartao}
								onValueChange={(values: NumberFormatValues) =>
									setFormList((prev) => ({ ...prev, nCartao: values.value }))
								}
								className="input mb-3"
								type="text"
								id="nCartao"
							/>

							<div className="flex items-center gap-4">
								<div>
									<label htmlFor="validade" className="font-medium">
										Validade
									</label>
									<PatternFormat
										format="##/##"
										mask="_"
										allowEmptyFormatting
										value={formList.validade}
										onValueChange={(values: NumberFormatValues) =>
											setFormList((prev) => ({ ...prev, validade: values.value }))
										}
										className="input mb-3"
										type="text"
										id="validade"
									/>
								</div>
								<div>
									<label htmlFor="cvv" className="font-medium">
										CVV
									</label>
									<PatternFormat
										format="####"
										mask="_"
										allowEmptyFormatting
										value={formList.cvv}
										onValueChange={(values: NumberFormatValues) =>
											setFormList((prev) => ({ ...prev, cvv: values.value }))
										}
										placeholder="CVV"
										className="input mb-3"
										type="text"
										id="cvv"
									/>
								</div>
							</div>
							<Button type="button" className="mt-3" onClick={() => setEtapa("dadosPessoal")}>Próximo</Button>
						</>
					)}
					{etapa === "dadosPessoal" && (
						<>
							<Input
								textLabel="Apelido do cartão"
								id="apelido"
								type="text"
								value={formList.apelido}
								onChange={(value) =>
									setFormList({ ...formList, apelido: value })
								}
								className="mb-3 mt-3"
							/>
							<Input
								textLabel="Nome impresso no cartão"
								id="nome"
								type="text"
								value={formList.nome}
								onChange={(value) =>
									setFormList({ ...formList, nome: value })
								}
								className="mb-3"
							/>
							<label htmlFor="cpf" className="font-medium">
								CPF do titular
							</label>
							<PatternFormat
								format="###.###.###-##"
								mask="_"
								allowEmptyFormatting
								value={formList.cpf}
								onValueChange={(values: NumberFormatValues) =>
									setFormList((prev) => ({ ...prev, cpf: values.value }))
								}
								className="input mb-3"
								type="text"
								id="cpf"
							/>

							<Button className="mt-3">Salvar</Button>
						</>
					)}
				</form> 
			</Modal>
		</div>
	)

}