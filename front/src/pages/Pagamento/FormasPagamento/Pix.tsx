import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { GoClockFill } from "react-icons/go";
import { FaAngleLeft } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { BiSolidHandDown } from "react-icons/bi";
import { GoCopy } from "react-icons/go";
import { usePixComponent } from "@/hooks/Pagamento/usePix";
import VisualizacaoConometro from "../components/VisualizacaoConometro";
import { Loader2 } from "lucide-react";

export default function PagePix() {
	const {
		copied,
		key,
		showModal,
		setShowModal,
		statusPagamento,
		respPagamento,
		acompanharPedido,
		setStatusPagamento,
		handleCopy,
		statusTipo,
		qrCodeGenerico,
		loadingGenerico,
		qrCodeMercadoPago,
		loadingMP,
		pagamentoIniciado,
		setPagamentoIniciado,
		pagoComMP,
		stausPagamentoPix
	} = usePixComponent();

	return (
		<>
			<>
				{!pagamentoIniciado && (
					<>
						<p className="mt-5 font-bold text-center">Escolha uma opção para o pagamento:</p>
						<div className="">
							<Button
								onClick={() => {
									setPagamentoIniciado(true);
									qrCodeGenerico();
								}}
								disabled={loadingGenerico}
								color="secondary"
								className="p-2 whitespace-nowrap flex justify-center gap-3 items-center mb-5 mt-5"
							>
								{loadingGenerico && <Loader2 className="h-4 w-4 animate-spin" />}
								<span>{loadingGenerico ? "Processando..." : "Simule Pagamento"}</span>
							</Button>

							<Button
								onClick={() => {
									setPagamentoIniciado(true);
									qrCodeMercadoPago();
								}}
								disabled={loadingMP}
								className="p-2 whitespace-nowrap flex justify-center gap-3 items-center mb-5"
							>
								{loadingMP && <Loader2 className="h-4 w-4 animate-spin" />}
								<span>{loadingMP ? "Processando..." : "Pague com Mercado Pago"}</span>
							</Button>
						</div>
					</>
				)}

			</>

			{(loadingGenerico || loadingMP) && !respPagamento.qr_code_base64 && (
				<div className="text-center mt-5 flex justify-center items-center gap-3 text-brown-normal">
					<Loader2 className="h-4 w-4 animate-spin" />
					<span>Gerando QR Code...</span>
				</div>
			)}


			{respPagamento.qr_code_base64 && (
				<>
					{(statusPagamento === "pendente" || statusPagamento === "processando") && (
						<>
							<div className="flex justify-center items-cente">
								<img key={key} className="w-50" src={respPagamento.qr_code_base64} alt="QR Code de Pagamento" />
							</div>
							<p className="w-100 text-center my-3">Abra um aplicativo em que você tenha o Pix habilitado e escolha a opção Pagar, em seguida Ler QR Code</p>

							<div className="text-center">
								<p className="my-2 flex items-center justify-center gap-1">
									Pix copia e cola
									<BiSolidHandDown />
								</p>
								<button
									onClick={handleCopy}
									className="hover:bg-brown-light-active bg-brown-light text-gray-medium hover:border-brown-normal my-2 w-100 cursor-pointer rounded border px-3 py-1"
								>
									<div className="flex items-center justify-between gap-2">
										<p className="w-80 truncate bg-transparent">
											{respPagamento.qr_code}
										</p>
										<GoCopy className="icon" />
									</div>
								</button>
								{copied &&
									<>
										<p className="mt-2">Código copiado!</p>

										<hr className="text-gray-light my-3" />
									</>
								}
							</div>
							<VisualizacaoConometro
								onExpire={() => {
									setStatusPagamento("expirou");
									setShowModal(false);
								}}
							/>

							<div className="flex items-center gap-2 mt-3 mb-5">
								<div className="relative flex h-2 w-2">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue opacity-75"></span>
									<span className="relative inline-flex h-2 w-2 rounded-full bg-blue"></span>
								</div>

								<p>O status: <span className="font-bold">{statusTipo[statusPagamento]}</span></p>
							</div>

							{pagoComMP && (
								<Button
									className="my-6 p-2 bg-brown-light-active text-brown-normal hover:text-white"
									onClick={stausPagamentoPix}
								>
									Confirmar pagamento
								</Button>
							)}
						</>
					)}

				</>
			)}

			<Modal isOpen={showModal} onClose={acompanharPedido} className="py-2" >
				<p className="flex justify-center items-center text-[2rem] text-green">
					<FaCheckCircle />
				</p>
				<p className="text-center mt-3">Pagamento processado com sucesso! <br /> <span className="font-bold">Pedido em andamento</span></p>

				<Button className="mt-5 p-2" onClick={acompanharPedido} >Acompanhe seu pedido</Button>
			</Modal>

			{statusPagamento === "expirou" && (
				<div className='mb-5'>
					<div className='flex items-center justify-center text-2xl'>
						<GoClockFill />
					</div>
					<p className='text-center mt-2'>
						<span className='font-bold'>O tempo para pagamento expirou. </span>
						<br />
					</p>
					<p className='flex items-center justify-center mt-1'>
						Clique em volta (<FaAngleLeft />) para iniciar sua compra novamente!
					</p>
				</div>
			)}
		</>
	);
}
