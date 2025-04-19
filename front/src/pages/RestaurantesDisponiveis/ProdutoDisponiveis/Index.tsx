import { useContext, useState } from "react";
import { Minus, Plus } from "lucide-react";
import Button from "../../../components/ui/Button";
import { IProduto } from "../../../interface/IProduct";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IRestaurante } from "../../../interface/IRestaurante";
import { CarrinhoContext } from "../../../contexts/CarrinhoContext";
interface CardProdutosProps extends IProduto {
	dadosRestaurante: IRestaurante;
}

export default function CardProdutos({
	id,
	nome,
	descricao,
	imageUrl,
	valor_unitario,
	dadosRestaurante,
}: CardProdutosProps) {

	console.log("dadosRestaurante", dadosRestaurante);
	const [quantidade, setQuantidade] = useState(0);
	const [carrinho, setCarrinho] = useState<any[]>([]);
	const { atualizarQuantidadeTotal } = useContext(CarrinhoContext);


	const incrementar = () => setQuantidade((q) => q + 1);
	const decrementar = () => setQuantidade((q) => (q > 0 ? q - 1 : 0));

	async function adicionarAoCarrinho() {
		console.log("Entrou na lógica");
		console.log("dadosRestaurante:", dadosRestaurante);

		const addItem = {
			id,
			nome,
			descricao,
			imageUrl,
			valor_unitario,
			quantidade,
			subtotal: valor_unitario * quantidade,
			restaurante: dadosRestaurante,
		};

		const storedCarrinho = localStorage.getItem("carrinho");
		let carrinho = storedCarrinho ? JSON.parse(storedCarrinho) : [];

		const itemIndex = carrinho.findIndex((item: any) => item.id === addItem.id);

		if (itemIndex !== -1) {
			const itemExistente = carrinho[itemIndex];

			if (itemExistente.quantidade === addItem.quantidade) {
				console.log("A quantidade não foi alterada, mantendo a mesma.");
				return;
			}

			if (addItem.quantidade > itemExistente.quantidade) {
				const diff = addItem.quantidade - itemExistente.quantidade;
				itemExistente.quantidade = addItem.quantidade;
				itemExistente.subtotal += diff * itemExistente.valor_unitario;
			} else {
				const diff = itemExistente.quantidade - addItem.quantidade;
				itemExistente.quantidade = addItem.quantidade;
				itemExistente.subtotal -= diff * itemExistente.valor_unitario;
			}
		} else {
			carrinho.push(addItem);
		}

		localStorage.setItem("carrinho", JSON.stringify(carrinho));
		setCarrinho(carrinho);
		atualizarQuantidadeTotal();
	}


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
					<Button className="p-2 flex items-center justify-between"
						disabled={quantidade === 0}
						onClick={adicionarAoCarrinho}>
						<div className="flex items-center gap-2">
							<AiOutlineShoppingCart className="text-2xl" />
							<p>Adicionar</p>
						</div>

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
