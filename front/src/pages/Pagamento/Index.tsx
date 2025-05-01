import Button from "../../components/ui/Button";
import { SiPix } from "react-icons/si";
import { TfiMapAlt } from "react-icons/tfi";
import { BsCreditCardFill } from "react-icons/bs";
import PagePix from "./FormasPagamento/Pix";
import PageCartao from "./FormasPagamento/Cartao";
import CardsOpcoes from "./components/CardsOpcoes";
import IconAction from "@/components/ui/IconAction";
import { usePagamento } from "@/hooks/Pagamento/usePagamento";
import { useEffect, useState } from "react";


export default function Pagamento() {
	const {
		restaurante,
		subtotal,
		valoresCarrinho,
		selecionado,
		setSelecionado,
		endereco,
		etapa,
		setEtapa,
		modeloPagamento,
		setModeloPagamento
	} = usePagamento();

	const [taxaEntregaSelecionada, setTaxaEntregaSelecionada] = useState(0.00);
    const [duracaoPadrao, setDuracaoPadrao] = useState<string | null>(null);
    const [duracaoRapida, setDuracaoRapida] = useState<string | null>(null);
    const [taxaEntregaPadrao, setTaxaEntregaPadrao] = useState(0.00);
    const [taxaEntregaRapida, setTaxaEntregaRapida] = useState(0.00);

	// setando a taxa de entrega para padrão quando entrar na tela de pagamento
	useEffect(() => {
		setTaxaEntregaSelecionada(taxaEntregaPadrao);
	}
	,[taxaEntregaPadrao]);

	useEffect(() => {
        const storedFrete = JSON.parse(localStorage.getItem("restauranteSelecionado") || "null");
        if (storedFrete) {
            setTaxaEntregaPadrao(storedFrete.taxaEntrega || 0);
            setTaxaEntregaRapida(storedFrete.taxaEntrega * 1.15 || 0);
            setDuracaoPadrao(storedFrete.duration ? `${Math.floor(storedFrete.duration / 60)}-${Math.floor(storedFrete.duration / 60) + 10} min` : null);
            setDuracaoRapida(storedFrete.duration ? `${Math.floor((storedFrete.duration /60 ) * 0.8)}-${Math.floor((storedFrete.duration /60 )* 0.8) + 10} min` : null);
        }
        handleSelecionado("padrão");
    }, []);

	const handleSelecionado = (value: "padrão" | "rápida") => {
        setSelecionado(value);
        if (value === "padrão") {
            setTaxaEntregaSelecionada(taxaEntregaPadrao);
        } else if (value === "rápida") {
            setTaxaEntregaSelecionada(taxaEntregaRapida);
        }
    };

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
								<p className="font-semibold">{endereco}</p>
							</div>
							<Button color="plain" className="p-2 m-0 w-12">Trocar</Button>
						</div>
					</div>
					<hr className="text-gray-light my-2" />
				</div>
				<div className="mt-5 text-center">
                    <h2 className="text-xl font-semibold mb-4">Escolha o tipo de entrega</h2>
                    <p className="text-sm text-gray-600">Selecione a forma de entrega para ver o valor da taxa e o tempo estimado.</p>
                </div>
                <div className="mt-5 flex gap-5">
                    <div
                        onClick={() => handleSelecionado("padrão")}
                        className={`w-full rounded-lg border-2 p-4 cursor-pointer ${
                            selecionado === "padrão" ? 'border-brown-normal text-brown-dark' : 'border-gray-300'
                        }`}
                    >
                        <p className="font-semibold">Padrão</p>
						<p className="text-sm font-semibold">Hoje, {duracaoPadrao}</p>
                        <p className="font-semibold text-black mt-2">R$ {taxaEntregaPadrao.toFixed(2)}</p>
                    </div>
                    <div
                        onClick={() => handleSelecionado("rápida")}
                        className={`w-full rounded-lg border-2 p-4 cursor-pointer ${
                            selecionado === "rápida" ? 'border-brown-normal text-brown-dark' : 'border-gray-300'
                        }`}
                    >
                        <p className="font-semibold">Rápida</p>
						<p className="text-sm font-semibold">Hoje, {duracaoRapida}</p>
                        <p className="font-semibold text-black mt-2">R$ {taxaEntregaRapida.toFixed(2)}</p>
                    </div>
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
									<PageCartao />
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
					<span>R$  {valoresCarrinho.subtotal}</span>
				</p>
				<p className="flex gap-8 items-center justify-between my-2">
					Taxa de entrega
					<span>R$ {taxaEntregaSelecionada.toFixed(2)}</span>
				</p>
				<p className="flex gap-8 items-center justify-between font-bold mt-10">
					Total
					<span>R$ {(valoresCarrinho.subtotal + taxaEntregaSelecionada).toFixed(2)}</span>
				</p>
			</div>
		</div>

	);
}