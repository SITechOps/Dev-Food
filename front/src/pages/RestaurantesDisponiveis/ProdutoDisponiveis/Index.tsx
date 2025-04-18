import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Button from "../../../components/ui/Button";
import { IProduto } from "../../../interface/IProduct";
import { AiOutlineShoppingCart } from "react-icons/ai";


export default function CardProdutos({
	nome,
	descricao,
	imageUrl,
	valor_unitario,
}: IProduto) {
	const [quantidade, setQuantidade] = useState(0);

	const incrementar = () => setQuantidade((q) => q + 1);
	const decrementar = () => setQuantidade((q) => (q > 0 ? q - 1 : 0));

	return (
		<div className="flex flex-col  gap-4 md:gap-8 md:flex-row items-center rounded-md border border-gray-medium bg-gray-light p-4 w-full">
			<img
				className="w-[10rem] rounded-md ml-4"
				src={imageUrl}
				alt={nome}
			/>

			<div className="">
				<h3 className="font-bold">{nome}</h3>
				<p className="mt-3 font-light">{descricao}</p>
				<p className="mt-3 font-normal text-2xl">R$ {valor_unitario}</p>

				<div className="mt-4 flex items-center gap-4">
					<div className="flex gap-6 p-2 items-center justify-between rounded-lg border border-gray-medium bg-white">
						<Button
							color="plain"
							onClick={decrementar}
							className="p-1"
						>
							<Minus size={20} className="stroke-2" />
						</Button>
						<span className="text-lg font-bold">{quantidade}</span>
						<Button
							color="plain"
							onClick={incrementar}
							className="p-1"
						>
							<Plus size={20} className="stroke-2" />
						</Button>
					</div>

					{/* Botão Adicionar */}
					<Button className="p-2 flex items-center justify-between">
					{/* <AiOutlineShoppingCart className="text-2xl"/> */}
					<p>Clique para adicionar</p>

						<span>
							R${" "}
							{quantidade > 0
								? (valor_unitario * quantidade).toFixed(2)
								: valor_unitario.toFixed(2)}
						</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
