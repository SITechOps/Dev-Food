import { FormEvent, useState } from "react";
import { api } from "../../connection/axios";
import { postUser } from "../../connection/AuthUserController";
import { useNavigate } from "react-router-dom";

export const useAuthUserComponent = () => {
	const navigate = useNavigate();
	const [telefone, setTelefone] = useState("");
	const [email, setEmail] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [codigoEnviado, setCodigoEnviado] = useState("");
	const [etapa, setEtapa] = useState<"email" | "telefone">("email");
  
	async function handleContinuar() {
	  setIsModalOpen(true);
  
	  try {
		const response = await api.post("/send-email", {
		  data: { email },
		});
		setCodigoEnviado(response.data.properties.verificationCode);
  
	  } catch (error) {
		console.error("Erro ao enviar email:", error);
		alert("Erro ao enviar email.");
	  }
	  setEtapa("telefone");
	}
  
	async function loginUser(event: FormEvent<HTMLFormElement>) {
	  event.preventDefault();
	  try {
		const token = await postUser(email, telefone);
	   
		if (!token) {
		  throw new Error("Token não encontrado na resposta da API.");
		}
		navigate("/");
		alert("Login realizado com sucesso!");
	  } catch (error: any) {
		console.error("Erro no login:", error);
		alert(error.response?.data?.message || "Erro ao fazer login.");
	  }
	}
  
	return {
		handleContinuar,
		telefone,
		setTelefone,
		email, 
		setEmail,
		isModalOpen, 
		setIsModalOpen,
		codigoEnviado,
		etapa, 
		setEtapa,
		loginUser
	}
}