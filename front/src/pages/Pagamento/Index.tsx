import Button from "../../components/ui/Button";
import { SiPix } from "react-icons/si";
import { TfiMapAlt } from "react-icons/tfi";
import { BsCreditCardFill } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa6";
import PagePix from "./FormasPagamento/Pix";
import PageCartao from "./FormasPagamento/Cartao";
import { usePagamento } from "../../hooks/usePagamento";


export default function Pagamento() {
	const {
		restaurante,
		subtotal,
		taxaEntrega,
		total,
		selecionado,
		setSelecionado,
		styleOptions,
		endereco,
		etapa,
		setEtapa
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

								<p className="font-semibold">{endereco.complemento}</p>
								<p>{endereco.ruaENumero}</p>
							</div>
							<Button color="plain" className="p-2 m-0 w-12">Trocar</Button>
						</div>
					</div>
					<hr className="text-gray-light my-2" />
				</div>
				<div>
					<div className="flex justify-between items-center w-100 mb-10">
						<Button
							onClick={() => setSelecionado("site")}
							color="plain"
							className={`pb-2 border-b-2 transition-all ${selecionado === "site"
								? "text-brown-normal border-brown-normal"
								: "text-gray-400 border-transparent"
								}`}>Pague pelo site</Button>

						{/* <Button
				onClick={() => setSelecionado("entrega")}
				color="plain"
				className={`pb-2 border-b-2 transition-all ${
					selecionado === "site"
						? "text-gray-light hover:text-gray-medium border-transparent"
						: "text-brown-normal border-brown-normal"
				}`}
			>
				Pague na entrega
			</Button> */}
					</div>
					<div id="pagamento">
						{etapa === "opcaoPagamento" && (
							<>
								<button className={styleOptions} onClick={() => setEtapa("pagePix")}>
									<SiPix className="text-2xl" />
									<div className="">
										<p className="font-semibold">Pague com Pix</p>
										<p className="font-light">Use o QR Code ou copie e cole o código</p>
									</div>
								</button>


								<button className={styleOptions} onClick={() => setEtapa("pageCartao")}>
									<BsCreditCardFill className="text-2xl" />
									<div className="">
										<p className="font-semibold">Pague com cartão</p>
										<p className="font-light">Cadastre-se seu cartao ou Escolha seu cartão</p>
									</div>
								</button>
							</>
						)}

						{etapa === "pagePix" && (
							<>
								<button
									onClick={() => setEtapa("opcaoPagamento")}
									className="mb-5 self-start"
								>
									<FaAngleLeft className="icon" />
								</button>

								<div className="mt-3">
									<PagePix />
								</div>
							</>
						)}
						{etapa === "pageCartao" && (
							<>
								<button
									onClick={() => setEtapa("opcaoPagamento")}
									className="mb-5 self-start"
								>
									<FaAngleLeft className="icon" />
								</button>
								<div className="mt-3">
									<PageCartao />
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			<div className="card mt-[5rem] p-4 m-auto border border-gray-light">
				<p></p>
				<p className="flex gap-8 items-center justify-between my-2 ">
					Compra realizado no restaurante:
                    <span className="font-bold">{restaurante}</span>
                  </p>
				  <hr className="border-b border-gray-medium my-4"/>
				<p className="flex gap-8 items-center justify-between my-2">
                    Subtotal
                    <span>R$  {subtotal.toFixed(2)}</span>
                  </p>
                  <p className="flex gap-8 items-center justify-between my-2">
                    Taxa de entrega
                    <span>R$ {taxaEntrega.toFixed(2)}</span>
                  </p>
				  <p className="flex gap-8 items-center justify-between font-bold">
                  Total
                  <span>R$ {total.toFixed(2)}</span>
                </p>
			</div>
		</div>

	);
}