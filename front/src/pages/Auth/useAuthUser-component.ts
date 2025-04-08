import { FormEvent, useState } from "react";
import { api } from "../../connection/axios";
import { postUser } from "../../connection/AuthUserController";
import { useNavigate } from "react-router-dom";

export const useAuthUserComponent = () => {
	const navigate = useNavigate();
	const [formList, setFormList] = useState({
		telefone: "",
		email: "",
	})

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [codigoEnviado, setCodigoEnviado] = useState("");
	const [etapa, setEtapa] = useState<"email" | "telefone">("email");
  
	async function handleContinuar() {
	  setIsModalOpen(true);
  
	  try {
		const response = await api.post("/send-email", {
			data: {
				email: formList.email,
			  }
		});
		setCodigoEnviado(response.data.properties.verificationCode);
		setEtapa("telefone");
  
	  } catch (error) {
		console.error("Erro na tentativa do envio do codigo:", error);
		alert("Erro na tentativa do envio do codigo");
	  }
	}
  
	async function loginUser(event: FormEvent<HTMLFormElement>) {
	  event.preventDefault();
	  try {
		  console.log(formList)
		const token = await postUser( formList.email, formList.telefone );
	   
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
		formList, 
		setFormList,
		isModalOpen, 
		setIsModalOpen,
		codigoEnviado,
		etapa, 
		setEtapa,
		loginUser
	}
}