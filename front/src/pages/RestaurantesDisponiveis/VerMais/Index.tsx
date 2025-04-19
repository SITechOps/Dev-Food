import { Clock, MapPin } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { useRestauranteDisponiveisDetalhes } from "../../../hooks/useRestauranteDisDetalhes";
import { Loading } from "../../../components/shared/Loading";

export default function VerMaisRestaurante({ onClose }: any) {
	const {
		restaurante,
		loading,
	} = useRestauranteDisponiveisDetalhes();
	
	return (
		<div className="fixed inset-0 z-50 flex justify-end bg-black/70">
			<div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 relative">
				<div className="mb-6 flex items-center justify-between">
					<h2 className="mt-8 text-xl font-bold">
						Informações do Restaurante
					</h2>
					<IoClose
						className="icon absolute top-3 right-4 cursor-pointer"
						size={26}
						onClick={onClose}
					/>
				</div>

				{loading ? (
					<Loading />
				) : (
					<div className="space-y-6">
						<h3 className="mb-2 font-semibold">Descrição</h3>
						<p className="text-gray-600">{restaurante.descricao}</p>

						<hr className="text-gray-normal" />

						<h3 className="mb-2 flex items-center font-semibold">
							<MapPin className="text-brown-normal mr-2 h-4 w-4" />
							Endereço
						</h3>
						<p className="text-gray-600">
							{restaurante.endereco?.logradouro},{" "}
							{restaurante.endereco?.bairro},{" "}
							{restaurante.endereco?.cidade},{" "}
							{restaurante.endereco?.estado},{" "}
							{restaurante.endereco?.pais}
						</p>

						<hr className="text-gray-normal" />

						<h3 className="mb-2 flex items-center font-semibold">
							<Clock className="text-brown-normal mr-2 h-4 w-4" />
							Horário de Funcionamento
						</h3>
						<p className="text-gray-600">
							{restaurante.horario_funcionamento}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
