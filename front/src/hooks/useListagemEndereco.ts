import { api } from "@/connection/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useConfirmacaoEndereco } from "@/contexts/ConfirmacaoEnderecoContext";
import { IEndereco } from "@/interface/IEndereco";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export const useListaEndereco = (onCloseModal?: () => void) => {
	const [enderecos, setEnderecos] = useState<IEndereco[]>([]);
	const [enderecoSelecionado, setEnderecoSelecionado] = useState<IEndereco | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const { userData, token } = useAuth();
	const idUsuario = userData?.sub;
	const location = useLocation();
	const navigate = useNavigate();

	const {
		confirmacaoPadrao,
		setEnderecoPadraoId,
		enderecoPadraoId,
		mostrarConfirmacao,
		confirmarEnderecoPadrao,
		cancelarConfirmacao
	} = useConfirmacaoEndereco();

	const carregarEnderecoPadraoLocal = useCallback(() => {
		const storedId = localStorage.getItem("enderecoPadraoId");
		if (storedId) setEnderecoPadraoId(storedId);
	}, [setEnderecoPadraoId]);

	const buscarEnderecos = useCallback(async () => {
		try {
			const response = await api.get(`/user/${idUsuario}/enderecos`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			const enderecosData = response.data?.data?.attributes || [];
			setEnderecos(enderecosData);

			if (enderecoPadraoId) {
				const enderecoPadrao = enderecosData.find((e: any) => e.id === enderecoPadraoId);
				setEnderecoSelecionado(enderecoPadrao || null);
			} else {
				setEnderecoSelecionado(enderecosData[0] || null);
			}
		} catch (error) {
			console.error("Erro ao buscar endereços:", error);
		}
	}, [idUsuario, token, enderecoPadraoId]);

	const handleDeleteEndereco = async (id: string) => {
		try {
			await api.delete(`/endereco/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			await buscarEnderecos();
		} catch (error) {
			console.error("Erro ao excluir endereço:", error);
		}
	};

	useEffect(() => {
		if (enderecoPadraoId) {
			buscarEnderecos();
		}
	}, [enderecoPadraoId]);


	useEffect(() => {
		carregarEnderecoPadraoLocal();
	}, [carregarEnderecoPadraoLocal, buscarEnderecos]);

	useEffect(() => {
		if (showModal) buscarEnderecos();
	}, [showModal, buscarEnderecos]);

	useEffect(() => {
		if (location.pathname === "/account" && showModal) {
			setShowModal(false);
		}
	}, [location.pathname, showModal]);

	const fecharModalEndereco = () => {
		onCloseModal ? onCloseModal() : setShowModal(false);
	};

	const filteredEnderecos = enderecos.filter((endereco) =>
		endereco.logradouro.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return {
		enderecoSelecionado,
		setEnderecoSelecionado,
		enderecos,
		setEnderecos,
		showModal,
		setShowModal,
		searchTerm,
		setSearchTerm,
		carregarEnderecoPadraoLocal,
		buscarEnderecos,
		handleDeleteEndereco,
		fecharModalEndereco,
		filteredEnderecos,
		mostrarConfirmacao,
		confirmarEnderecoPadrao,
		cancelarConfirmacao,
		confirmacaoPadrao,
		setEnderecoPadraoId,
		enderecoPadraoId,
		idUsuario,
		token,
		navigate,
		location,
	};
};