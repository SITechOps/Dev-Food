import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../../connection/axios";
import axios from "axios";

export const useCadastroRestaurante = () => {
	const [formList, setFormList] = useState({
		nome: "",
		telefone: "",
		email: "",
		cep: "",
		endereco: "",
		estado: "",
		cidade: "",
		bairro: "",
		complemento: "",
		numero: "",
		razaoSocial: "",
		cnpj: "",
		especialidade: "",  
		descricao: "",  
		banco: "",
		cAgencia: "",
		cCorrente: "",
	});
	const [etapa, setEtapa] = useState<"dadosLoja" | "enderecoLoja" | "complementoLoja" | "dadosBancarioLoja">("dadosLoja");
	const [cepLimpo, setCepLimpo] = useState("");
	const styleInput = "my-3";

	const [mostrarModal, setMostrarModal] = useState(false);
	const [codigoEnviado, setCodigoEnviado] = useState("");

	const navigate = useNavigate();

	async function validarEmail() {
		setMostrarModal(true);
		try {
			const response = await api.post("/send-email", {
				data: {
					email: formList.email,
				},
			});
			setCodigoEnviado(response.data.properties.verificationCode);
		} catch (error) {
			console.error("Erro na tentativa do envio do codigo:", error);
			alert("Erro na tentativa do envio do codigo");
		}
	}

	useEffect(() => {
		if (cepLimpo.length === 8) {
		  axios
			.get(`https://viacep.com.br/ws/${cepLimpo}/json/`)
			.then((res) => {
			  if (!res.data.erro) {
				setFormList((prev) => ({
				  ...prev,
				  estado: res.data.uf,
				  cidade: res.data.localidade,
				  bairro: res.data.bairro,
				  endereco: res.data.logradouro,
				}));
			  } else {
				console.warn("CEP não encontrado.");
			  }
			})
			.catch((err) => {
			  console.error("Erro ao buscar o CEP:", err);
			});
		}
	  }, [cepLimpo]);
	  

	  async function handleSubmit (event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const requestBody = {
		  nome: formList.nome,
		  descricao: formList.descricao, 
		  email: formList.email,
		  cnpj: formList.cnpj,
		  razao_social: formList.razaoSocial, 
		  especialidade: formList.especialidade,
		  telefone: formList.telefone,
		  horario_funcionamento: "", 
		  banco: formList.banco,
		  agencia: formList.cAgencia,
		  nro_conta: formList.cCorrente,
		  tipo_conta: "corrente", 
		  endereco: {
			logradouro: formList.endereco,
			bairro: formList.bairro,
			cidade: formList.cidade,
			estado: formList.estado,
			pais: "Brasil", 
			numero: parseInt(formList.numero) || 0,
			complemento: formList.complemento
		  }
		};
	  
		 await api.post("/restaurante", { data: requestBody })
		  .then((response) => {
			alert("Restaurante cadastrado com sucesso!");
			console.log("Restaurante cadastrado com sucesso!", response.data);
			return navigate("/account");
		  })
		  .catch((error) => {
			if (error.response.status === 409) {
				alert("Esse endereço já foi cadastrado por outro restaurante!");
			}
			console.error("Erro ao cadastrar restaurante:", error);
		  });
	  };
	  


	return {
		formList,
		setFormList,
		styleInput,    
		etapa,
		setEtapa,
		validarEmail,
		setCepLimpo,
		mostrarModal,
		setMostrarModal,
		codigoEnviado,
		setCodigoEnviado,
		handleSubmit
	};
};
