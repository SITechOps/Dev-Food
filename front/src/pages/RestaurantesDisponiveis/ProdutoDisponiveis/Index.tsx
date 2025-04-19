import { Minus, Plus } from "lucide-react";
import Button from "../../../components/ui/Button";
import { IProduto } from "../../../interface/IProduct";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IRestaurante } from "../../../interface/IRestaurante";
import { useCardProdutos } from "../../../hooks/useCardProduto";
interface CardProdutosProps extends IProduto {
	dadosRestaurante: IRestaurante;
}

export default function CardProdutos(props: CardProdutosProps) {
	const {
	  nome,
	  descricao,
	  imageUrl,
	  valor_unitario,
	  dadosRestaurante,
	} = props;
  
	const {
	  quantidade,
	  incrementar,
	  decrementar,
	  adicionarAoCarrinho,
	} = useCardProdutos(props, dadosRestaurante);


	return (
		<div
			className="w-full max-w-full rounded-md border border-gray-medium bg-gray-light p-4 transition-all duration-300 cursor-pointer"
		>
			<div className="flex gap-8  items-center">
				<img
					className="ml-2 mr-2 w-15 h-15 object-cover rounded-full mb-4 mx-auto"
					src={imageUrl}
					alt={nome}
				/>
				<h3 className="font-bold">{nome}</h3>
			</div>

			<div className="w-full">
				<p className="mt-3 font-light">{descricao}</p>
				<p className="mt-3 text-3x1 font-semibold">R$ {valor_unitario}</p>

				<div className="mt-2">
					<div className="flex flex-row gap-4 items-center w-full justify-end">
						<div className="flex gap-6 p-2 items-center justify-between rounded-lg border border-gray-medium bg-white">
							<Button color="plain" onClick={decrementar} className="p-1">
								<Minus size={20} className="stroke-2" />
							</Button>
							<span className="text-lg font-bold">{quantidade}</span>
							<Button color="plain" onClick={incrementar} className="p-1">
								<Plus size={20} className="stroke-2" />
							</Button>
						</div>

						<Button
							className="p-2 flex gap-6 items-center justify-between w-full md:w-auto"
							disabled={quantidade === 0}
							onClick={adicionarAoCarrinho}
						>
							<div className="flex items-center gap-2">
								<AiOutlineShoppingCart className="text-2x1" />
								<p className="text-sm md:text-base">Adicionar</p>
							</div>
							<span className="text-sm md:text-base">
								R$ {quantidade > 0 ? (valor_unitario * quantidade).toFixed(2) : valor_unitario.toFixed(2)}
							</span>
						</Button>
					</div>
				</div>
			</div>
		</div>

	);
}
