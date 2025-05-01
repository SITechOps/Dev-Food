import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { GoClockFill } from "react-icons/go";
import { FaAngleLeft } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { BiSolidHandDown } from "react-icons/bi";
import { GoCopy } from "react-icons/go";
import { Loading } from "@/components/shared/Loading";
import { usePixComponent } from '@/hooks/Pagamento/usePix';
import VisualizacaoConometro from "../components/VisualizacaoConometro";
import { usePagamento } from "@/hooks/Pagamento/usePagamento";

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
	} = usePixComponent();
	const { navigate } = usePagamento();


	return (
		<>
			{respPagamento.qr_code_base64 ? (
				<>
					{(statusPagamento === "pendente" || statusPagamento === "processando") && (
						<>
							<div className="flex justify-center items-cente">
								<img key={key} className="w-50" src={respPagamento.qr_code_base64} alt="QR Code de Pagamento" />
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
										<p className="bg-transparent truncate w-80">{respPagamento.qr_code}
										</p>
										<GoCopy className='icon' />

									</div>
								</button>
								{copied && (
									<p className="mt-2">Código copiado!</p>
								)}
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

							{/* <Button className="my-6 p-2 bg-brown-light-active text-brown-normal hover:text-white" onClick={() => { }}>Confirmar pagamento</Button> */}
						</>
					)}
					
					<Modal isOpen={showModal} onClose={() => { acompanharPedido; navigate("/")  }} className="py-2" >
						<p className="flex justify-center items-center text-[2rem] text-green">
							<FaCheckCircle />
						</p>
						<p className="text-center mt-3">Pagamento processado com sucesso! <br /> <span className="font-bold">Pedido em andamento</span></p>

						<Button className="mt-5 p-2" onClick={acompanharPedido} >Acompanhe seu pedido</Button>
					</Modal>


					{statusPagamento === "expirou" && (
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
