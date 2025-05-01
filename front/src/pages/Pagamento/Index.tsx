import Button from "../../components/ui/Button";
import { SiPix } from "react-icons/si";
import { TfiMapAlt } from "react-icons/tfi";
import { BsCreditCardFill } from "react-icons/bs";
import PagePix from "./FormasPagamento/Pix";
// import PageCartao from "./FormasPagamento/Cartao";
import CardsOpcoes from "./components/CardsOpcoes";
import IconAction from "@/components/ui/IconAction";
import { usePagamento } from "@/hooks/Pagamento/usePagamento";
import TesteCartao from "./FormasPagamento/teste";


export default function Pagamento() {
	const {
		restaurante,
		valoresCarrinho,
		selecionado,
		setSelecionado,
		endereco,
		etapa,
		setEtapa,
		modeloPagamento,
		setModeloPagamento
	} = usePagamento();

	return (
		<div className="flex flex-col xl:flex-row items-center gap-8 justify-center min-h-screen">
			<div className="card mt-[5rem] p-4 m-auto border border-gray-light">
				<h1 className="my-8 text-center font-medium">
					Finalize seu pedido
				</h1>

				<div>
					<p className="text-brown-normal text-center border-brown-normal pb-2 border-b-2 transition-all w-30 rounded-sm mb-5">Entrega</p>
					<div className="flex items-center gap-5">
						<TfiMapAlt className="text-3xl" />
						<div className="flex gap-4 items-center justify-between w-full my-4">
							<div>
								{endereco.length > 0 ? (
									<div>
										<p className="font-semibold">Endereço Selecionado:</p>
										<p>{endereco[0].logradouro}, {endereco[0].bairro}-{endereco[0].estado}</p>
									</div>
								) : (
									<p>Carregando endereço...</p>
								)}
							</div>
							<Button color="plain" className="p-2 m-0 w-12">Trocar</Button>
						</div>
					</div>
					<hr className="text-gray-light my-2" />
				</div>
				<div>
					<div className="flex justify-between items-center w-100 mb-10">
						<Button
							onClick={() => {
								setSelecionado("site");
								setModeloPagamento("site");
							}}
							color="plain"
							className={`pb-2 border-b-2 transition-all ${selecionado === "site"
								? "text-brown-normal border-brown-normal"
								: " hover:text-blue-dark border-transparent"
								}`}>Pague pelo site
						</Button>
						<Button
							onClick={() => {
								setSelecionado("entrega");
								setModeloPagamento("entrega");
							}}
							color="plain"
							className={`pb-2 border-b-2 transition-all ${selecionado === "site"
								? "text-blue hover:text-blue-dark border-transparent"
								: "text-brown-normal border-brown-normal"
								}`}
						>
							Pague na entrega
						</Button>
					</div>
					{modeloPagamento === "site" && (
						<>
							{etapa === "opcaoPagamento" && (
								<>
									<CardsOpcoes
										icon={<SiPix />}
										title="Pague com Pix"
										subtitle="Use o QR Code ou copie e cole o código"
										onClick={() => setEtapa("pagePix")}
									/>
									<CardsOpcoes
										icon={<BsCreditCardFill />}
										title="Pague com cartão"
										subtitle="Cadastre-se seu cartao ou Escolha seu cartão"
										onClick={() => setEtapa("pageCartao")}
									/>
								</>
							)}

							{etapa === "pagePix" && (
								<>
									<IconAction onClick={() => setEtapa("opcaoPagamento")}>
										Pix
									</IconAction>
									<PagePix />
								</>
							)}
							{etapa === "pageCartao" && (
								<>
									<IconAction onClick={() => setEtapa("opcaoPagamento")}>
										Cartão
									</IconAction>
									{/* <PageCartao /> */}
									<TesteCartao />
								</>
							)}
						</>
					)}
					{modeloPagamento === "entrega" && (
						<p className="text-center font-bold">
							Tela em construção....
						</p>
					)}
				</div>
			</div>
			<div id="cardLateral" className="card mt-[5rem] w-100 p-4 m-auto border border-gray-light">
				<p className="flex gap-8 items-center justify-between my-2 ">
					Compra realizado no restaurante:
				</p>
				<span className="font-bold">{restaurante}</span>
				<hr className="border-b border-gray-medium my-4" />
				<p className="flex gap-8 items-center justify-between my-2">
					Subtotal
					<span>R$  {Number(valoresCarrinho.subtotal).toFixed(2)}</span>
				</p>
				<p className="flex gap-8 items-center justify-between my-2">
					Taxa de entrega
					<span>R$ {Number(valoresCarrinho.taxaEntrega).toFixed(2)}</span>
				</p>
				<p className="flex gap-8 items-center justify-between font-bold mt-10">
					Total
					<span>R$ {Number(valoresCarrinho.total).toFixed(2)}</span>
				</p>
			</div>
		</div>

	);
}