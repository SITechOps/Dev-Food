import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../connection/axios";

export const useRestauranteDisponiveisDetalhes = () => {
	const { id } = useParams();
	const [restaurante, setRestaurante] = useState({
		nome: "",
		descricao: "",
		especialidade: "",
		endereco: {
			logradouro: "",
			bairro: "",
			cidade: "",
			estado: "",
			pais: "",
		},
		horario_funcionamento: "",
	});
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();
	const jsonProdutos = {
		produtos: [
			{
				id: "1",
				nome: "Fricassê de Frango (Festival)",
				descricao: "Frango desfiado ao molho branco (bechamel e Catupiry) finalizado com milho verde. Acompanha batata palha e arroz soltinho saboroso.",
				imageUrl:
					"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
				valor_unitario: 29.99,
			},
			{
				id: "2",
				nome: "Fricassê de Frango (Festival) 2",
				descricao: "Frango desfiado ao molho branco (bechamel e Catupiry) finalizado com milho verde. Acompanha batata palha e arroz soltinho saboroso.",
				imageUrl:
					"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
				valor_unitario: 19.99,
			},
		],
	}

	useEffect(() => {
		async function getDetalhesRestaurante() {
			try {
				const response = await api.get(`/restaurante/${id}`);
				setRestaurante(response.data.data.attributes);
				setLoading(false);
			} catch (error) {
				console.error("Erro ao buscar detalhes do restaurante:", error);
				setLoading(false);
			}
		}

		getDetalhesRestaurante();
	}, [id]); 


	return {
		restaurante,
		navigate,
		loading,
		setLoading,
		isModalOpen,
		setIsModalOpen,
		jsonProdutos
	}
}