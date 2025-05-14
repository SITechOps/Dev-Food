import { useMemo, useState } from "react";
import React from "react";
import { useRestauranteProduto } from "@/contexts/VisaoCliente/Restaurante&ProdutoContext";
import { useConfirmacaoEndereco } from "@/contexts/ConfirmacaoEnderecoContext";
import CardProdutos from "../ProdutoDisponiveis/Index";
import Input from "@/components/ui/Input";
import CardRestaurante from "../Card";
import IconAction from "@/components/ui/IconAction";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

export default function FiltroLupa() {
	const [abaAtiva, setAbaAtiva] = useState("restaurantes");
	const [searchParams] = useSearchParams();
	const initialQuery = searchParams.get("query") || "";
	const [searchTerm, setSearchTerm] = useState(initialQuery);
	const CardRestauranteMemo = React.memo(CardRestaurante);
	const { produtosAll } = useRestauranteProduto();
	const { restaurantesCompletos } = useConfirmacaoEndereco();
	const searchTermLower = searchTerm.toLowerCase();
	const navigate = useNavigate();

	const restaurantesFiltrados = useMemo(() => {
		if (!searchTerm.trim()) return restaurantesCompletos;

		return restaurantesCompletos.filter((restaurante) => {
			return (
				restaurante.nome?.toLowerCase().includes(searchTermLower) ||
				restaurante.especialidade?.toLowerCase().includes(searchTermLower) ||
				restaurante.descricao?.toLowerCase().includes(searchTermLower) ||
				restaurante.endereco?.logradouro?.toLowerCase().includes(searchTermLower) ||
				restaurante.endereco?.bairro?.toLowerCase().includes(searchTermLower) ||
				restaurante.endereco?.cidade?.toLowerCase().includes(searchTermLower)
			);
		});
	}, [searchTerm, restaurantesCompletos]);

	const produtosFiltrados = useMemo(() => {
		if (!searchTerm.trim()) return [];
		return produtosAll
			.filter((produto) =>
				produto.nome?.toLowerCase().includes(searchTermLower)
			)
			.map((produto) => ({
				...produto,
				restaurante: restaurantesCompletos.find((r) => r.id === produto.id_restaurante),
			}));
	}, [searchTerm, produtosAll, restaurantesCompletos]);

	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); 
	};

	return (
		<div className="mt-[5rem]">
			<IconAction
				className="hover:bg-brown-light-active mt-[5rem] flex cursor-pointer items-center justify-center gap-3 self-start rounded-md p-2"
				onClick={() => navigate("/")}
			>
				<p className="text-2xl">Voltar</p>
			</IconAction>

			<h3 className="text-blue my-3 text-center font-medium">
				Insira o nome do restaurante ou item desejado
			</h3>

			<form onSubmit={handleSubmit} className="mx-auto mb-8 max-w-md">

				<Input
					type="text"
					value={searchTerm}
					onChange={handleSearchChange}
					placeholder="Buscar..."
					className="!bg-white border border-blue w-full rounded-md px-4 py-2 shadow-sm"
				/>

			</form>
			<>
				<div className="mt-6 mb-6 flex border-b border-gray-300">
					<button
						className={`px-4 py-2 font-bold ${abaAtiva === "restaurantes"
							? "border-b-brown-normal text-brown-normal border-b-2 font-extrabold"
							: ""
							}`}
						onClick={() => setAbaAtiva("restaurantes")}
					>
						Restaurantes
					</button>
					<button
						className={`px-4 py-2 font-bold ${abaAtiva === "itens"
							? "border-b-brown-normal text-brown-normal border-b-2 font-extrabold"
							: ""
							}`}
						onClick={() => setAbaAtiva("itens")}
					>
						Itens
					</button>
				</div>

				{abaAtiva === "restaurantes" && restaurantesFiltrados.length > 0 && (
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
						{restaurantesFiltrados.map((restaurante) => (
							<CardRestauranteMemo key={restaurante.id} restaurante={restaurante} />
						))}
					</div>
				)}

				{abaAtiva === "itens" && produtosFiltrados.length > 0 && (
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 mt-10">
						{produtosFiltrados
							.filter((produto) => produto.restaurante)
							.map((produto) => (
								<CardProdutos
									key={produto.id}
									id={produto.id}
									nome={produto.nome}
									descricao={produto.descricao}
									imageUrl={produto.imageUrl}
									valor_unitario={produto.valor_unitario}
									dadosRestaurante={produto.restaurante!}
								/>
							))}
					</div>
				)}

				{restaurantesFiltrados.length === 0 && produtosFiltrados.length === 0 && (
					<p className="text-muted-foreground text-center">Nenhum resultado encontrado.</p>
				)}
			</>

		</div>
	);
}
