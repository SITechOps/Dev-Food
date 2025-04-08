import { useNavigate } from "react-router-dom";
import { api } from "../../connection/axios";
import { FormEvent, useEffect, useState } from "react";
import { decodeToken } from "../../utils/decodeToken";

export const useAccountComponent = () => {
	const navigate = useNavigate();
	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [telefone, setTelefone] = useState("");
	const token = localStorage.getItem("token");
	const [isEditing, setIsEditing] = useState(false);
	const idUsuario = token ? decodeToken(token)?.sub : undefined;

	useEffect(() => {
		if (!idUsuario) return;
		fetchUserData();
	  }, [idUsuario]);
	
	  async function fetchUserData() {
		try {
		  const response = await api.get(`/user/${idUsuario}`);
		  const respUser = response.data?.data?.attributes || [];
		  setNome(respUser.nome || "");
		  setEmail(respUser.email || "");
		  setTelefone(respUser.telefone || "");
		} catch (error) {
		  console.error("Erro ao buscar usuário:", error);
		}
	  }
	
	  async function alterarDados(event: FormEvent<HTMLFormElement>) {
		console.log(event)
		event.preventDefault();
		const dados = new FormData(event.currentTarget);
		console.log("dados", dados)
		const nome = dados.get("nome")?.toString();
		const telefone = dados.get("telefone")?.toString();
		console.log(telefone)
		console.log(nome)
		try {
		  await api.put(`/user/${idUsuario}`, { data: { nome, telefone, email } });
		  alert("Usuário alterado com sucesso!");
		  setIsEditing(false);
		} catch (error) {
		  alert("Erro ao alterar usuário. Tente novamente.");
		}
		fetchUserData();
	  }
	
	  async function deletarDados() {
		try {
		  await api.delete(`/user/${idUsuario}`);
		  alert("Usuário removido com sucesso!");
	
		  localStorage.clear();
		  navigate("/");
		} catch (error) {
		  console.error(error);
		  alert("Erro ao deletar usuário. Tente novamente.");
		}
	  }
	
	  function handleLogout() {
		localStorage.clear();
		navigate("/Auth");
	  }

	  return{
		navigate,
		nome, 
		setNome,
		email, 
		telefone, 
		setTelefone,
		isEditing, 
		setIsEditing,
		idUsuario,
		handleLogout,
		deletarDados,
		alterarDados,
	  }
}