import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { GoClockFill } from "react-icons/go";
import { FaAngleLeft } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { BiSolidHandDown } from "react-icons/bi";
import { GoCopy } from "react-icons/go";
import { Loading } from "@/components/shared/Loading";
import { usePixComponent } from '@/hooks/FormasPagamento/usePix';
import VisualizacaoConometro from "../components/VisualizacaoConometro";

export default function PagePix() {
	const {
		copied,
		key,
		showModal,
		setShowModal,
		statusPagamento,
		eventStaus,
		respPagamento,
		stausPagamentoPix,
		handleCopy,
		tempoDeProcessamento,
	} = usePixComponent();

	return (
		<>
			{respPagamento.qrCode ? (
				<>
					{tempoDeProcessamento === "andamento" && (
						<>
							<div className="flex justify-center items-cente">
								<img key={key}  className="w-50" src={`data:image/svg;base64,${respPagamento.qrCode}`} alt="QR Code de Pagamento" />
							</div>
							<p className="w-100 text-center my-3">Abra um aplicativo em que você tenha o Pix habilitado e escolha a opção Pagar, em seguida Ler QR Code</p>

							<div className="text-center">
								<p className="my-2 flex gap-1 items-center justify-center">
									Pix copia e cola
									<BiSolidHandDown />
								</p>
								<button
									onClick={handleCopy}
									className="my-2 px-3 py-1 rounded hover:bg-brown-light-active bg-brown-light text-gray-medium border hover:border-brown-normal cursor-pointer w-100"
								>
									<div className='flex items-center  justify-between gap-2'>
										<p className="bg-transparent truncate w-80">{respPagamento.pixCode}
										</p>
										<GoCopy className='icon' />

									</div>
								</button>
								{copied && (
									<p className="mt-2">Código copiado!</p>
								)}

							</div>
							<VisualizacaoConometro />

							<Button className="my-6 p-2 bg-brown-light-active text-brown-normal hover:text-white" onClick={stausPagamentoPix}>Confirmar pagamento</Button>

							<Modal isOpen={showModal} onClose={() => setShowModal(false)} >
								<div className="my-2">
									{eventStaus === "andamento" && (
										<>
											<VisualizacaoConometro />
											<p className='mt-3 text-center'>O status do seu pagamento : <span className='font-bold'>{statusPagamento}</span></p>
										</>
									)}

									{eventStaus === "concluido" && (
										<>
											<p className="flex justify-center items-center text-[2rem] text-green">
												<FaCheckCircle />
											</p>
											<p className="text-center mt-3">Pagamento processado com sucesso! <br/> <span className="font-bold">Pedido em andamento</span></p>

											<Button className="mt-5 p-2">Acompanhe seu pedido</Button>
										</>
									)}
								</div>
							</Modal>
						</>
					)}

					{tempoDeProcessamento === "concluido" && (
						<>
							<p className='mb-5'>
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
							</p>
						</>
					)}

				</>
			) : (
				<>
					<Loading />
				</>
			)}
		</>
	);
}
