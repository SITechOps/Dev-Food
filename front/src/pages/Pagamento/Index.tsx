import { useState } from "react";
import Button from "../../components/ui/Button";
import { SiPix } from "react-icons/si";
import { TfiMapAlt } from "react-icons/tfi";
import { BsCreditCardFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";
import PagePix from "./FormasPagamento/Pix";
import PageCartao from "./FormasPagamento/Cartao";


export default function Pagamento() {
	const [selecionado, setSelecionado] = useState<"site" | "entrega">("site");
	const styleOptions = "text-left hover:bg-brown-light hover:text-brown-normal text-blue cursor-pointer flex gap-6 items-center mb-5 border border-gray-medium hover:border-brown-light-active rounded-sm p-3 w-[25rem]";
	const endereco = {
		ruaENumero: "Rua das Laranjeiras, 123",
		complemento: "Apto 45, Bloco B - São Paulo - SP"
	}
	const navigate = useNavigate();
	const [etapa, setEtapa] = useState<"opcaoPagamento" | "pagePix" | "pageCartao">("opcaoPagamento");

	return (
		<div className="card mt-[5rem] w-[50rem] p-4 m-auto border-b border-gray-medium">
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
	);
}