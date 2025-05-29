import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import { decodeToken } from "@/shared/utils/decodeToken";

interface CnpjApiResponse {
  fantasia?: string; // Nome fantasia
  nome?: string;     // Razão Social
  status?: string;   // Ex: "OK" ou "ERROR"
  message?: string;  // Mensagem em caso de erro da API externa
}

interface CepApiResponse {
  uf?: string;
  localidade?: string; // Cidade
  bairro?: string;
  logradouro?: string;
  erro?: boolean; // Padrão ViaCEP para CEP não encontrado
  message?: string; // Para mensagens de erro do seu backend
}


export const useCadastroRestaurante = () => {
  const [formList, setFormList] = useState({
    nome: "", // Este será o "Nome fantasia do restaurante" (primeira etapa)
    telefone: "",
    email: "",
    cep: "",
    endereco: "",
    estado: "",
    cidade: "",
    bairro: "",
    complemento: "",
    numero: "",
    nomeFantasia: "", // Este é o "Nome Fantasia (Consultado)" (etapa complementoLoja) e usado como razao_social no submit
    cnpj: "",
    especialidade: "",
    descricao: "",
    horario_funcionamento: "",
    banco: "",
    cAgencia: "",
    cCorrente: "",
  });

  const [etapa, setEtapa] = useState<
    "dadosLoja" | "enderecoLoja" | "complementoLoja" | "dadosBancarioLoja"
  >("dadosLoja");
  const [cepLimpo, setCepLimpo] = useState("");
  const styleInput = "my-3";

  const [mostrarModal, setMostrarModal] = useState(false);
  const [codigoEnviado, setCodigoEnviado] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isLoadingNomeFantasia, setIsLoadingNomeFantasia] = useState(false);
  const [nomeFantasiaError, setNomeFantasiaError] = useState("");
  const [isNomeRestauranteLocked, setIsNomeRestauranteLocked] = useState(false); // NOVO ESTADO

  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");

  const navigate = useNavigate();

  const fetchnomeFantasiaPorCNPJ = useCallback(async (cnpjValue: string) => {
    // cnpjValue aqui já deve ser o CNPJ limpo (só números) vindo do componente
    if (!cnpjValue) {
      setFormList(prev => ({ ...prev, nomeFantasia: "" /* nome: "" // Opcional: limpar formList.nome */ }));
      setNomeFantasiaError("");
      setIsNomeRestauranteLocked(false); // Desbloqueia se CNPJ for apagado
      return;
    }

    // O componente já envia o CNPJ limpo, então a limpeza aqui é uma redundância segura.
    const cleanedCnpj = cnpjValue.replace(/\D/g, "");

    if (cleanedCnpj.length !== 14) {
      setFormList(prev => ({ ...prev, nomeFantasia: "" /* nome: "" // Opcional: limpar formList.nome */ }));
      setNomeFantasiaError(""); // Limpa erro se CNPJ ficar incompleto
      setIsNomeRestauranteLocked(false); // Desbloqueia se CNPJ ficar incompleto
      return;
    }

    setIsLoadingNomeFantasia(true);
    setNomeFantasiaError("");
    // setIsNomeRestauranteLocked(false); // Desbloqueia antes de uma nova tentativa válida

    try {
      const response = await api.get<CnpjApiResponse>(`/consulta-cnpj/${cleanedCnpj}`);
      const data = response.data;

      // Tenta usar 'fantasia', senão 'nome' (Razão Social) como fallback para o campo nome fantasia.
      const nomeFantasiaDaAPI = data.fantasia || data.nome;

      if (data.status === "OK" && nomeFantasiaDaAPI) {
        setFormList(prev => ({
          ...prev,
          nome: nomeFantasiaDaAPI, // Preenche o campo da primeira etapa
          nomeFantasia: nomeFantasiaDaAPI // Preenche o campo da etapa "complementoLoja"
        }));
        setIsNomeRestauranteLocked(true); // Bloqueia o campo 'nome'
      } else {
        const errorMessage = data.message || "Nome Fantasia não encontrado ou CNPJ inválido na API externa.";
        setNomeFantasiaError(errorMessage);
        setFormList(prev => ({ ...prev, nomeFantasia: "" /* nome: "" // Opcional */ }));
        setIsNomeRestauranteLocked(false); // Desbloqueia em caso de falha ou ausência de nome
      }
    } catch (error: any) {
      console.error("Erro ao buscar Nome Fantasia via backend:", error);
      let errorMessage = "Falha ao consultar dados do CNPJ.";
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error_message || `Erro do servidor: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Não foi possível conectar ao servidor para consulta do CNPJ.";
      }
      setNomeFantasiaError(errorMessage);
      setFormList(prev => ({ ...prev, nomeFantasia: "" /* nome: "" // Opcional */}));
      setIsNomeRestauranteLocked(false); // Desbloqueia em caso de erro
    } finally {
      setIsLoadingNomeFantasia(false);
    }
  }, []); // setFormList, setNomeFantasiaError, setIsLoadingNomeFantasia, setIsNomeRestauranteLocked são estáveis

  useEffect(() => {
    if (cepLimpo.length === 8) {
      const fetchCepData = async () => {
        setIsLoadingCep(true);
        setCepError("");
        setFormList((prev) => ({
          ...prev,
          endereco: "", bairro: "", cidade: "", estado: "",
        }));
        try {
          const response = await api.get<CepApiResponse>(`/api/backend/consulta-cep/${cepLimpo}`);
          const data = response.data;

          if (!data.erro) {
            setFormList((prev) => ({
              ...prev,
              estado: data.uf || "",
              cidade: data.localidade || "",
              bairro: data.bairro || "",
              endereco: data.logradouro || "",
            }));
          } else {
            setCepError(data.message || "CEP não encontrado.");
            console.warn("CEP não encontrado via backend:", data);
          }
        } catch (error: any) {
          console.error("Erro ao buscar o CEP via backend:", error);
          let errorMessage = "Falha ao consultar dados do CEP.";
            if (error.response) {
              errorMessage = error.response.data?.message || error.response.data?.erro || `Erro do servidor: ${error.response.status}`;
          } else if (error.request) {
            errorMessage = "Não foi possível conectar ao servidor para consulta do CEP.";
          }
          setCepError(errorMessage);
        } finally {
          setIsLoadingCep(false);
        }
      };
      fetchCepData();
    } else {
      setCepError("");
      if (cepLimpo.length === 0) {
        setFormList((prev) => ({
          ...prev,
          endereco: "", bairro: "", cidade: "", estado: "",
        }));
      }
    }
  }, [cepLimpo]);

  const validarEmail = useCallback(async () => {
    if (!formList.email) {
      alert("Por favor, informe um e-mail."); // Considere usar um método de notificação melhor
      return;
    }
    setMostrarModal(true); // Mostra o modal antes da chamada para feedback imediato
    try {
      const response = await api.post("/api/backend/send-email", {
        email: formList.email,
      });
      // Ajuste conforme a estrutura exata da sua resposta de 'send-email'
      const verificationCode = response.data?.verificationCode || response.data?.properties?.verificationCode;
      if (verificationCode) {
        setCodigoEnviado(verificationCode);
      } else {
        console.warn("Código de verificação não recebido do backend:", response.data);
        // Poderia mostrar um erro para o usuário aqui
      }
    } catch (error: any) {
      console.error("Erro na tentativa do envio do codigo:", error);
      alert(error.response?.data?.message || "Erro na tentativa do envio do codigo de verificação.");
      setMostrarModal(false); // Fecha o modal em caso de erro na chamada
    }
  }, [formList.email]);

  const uploadRestauranteImage = useCallback(async (
    restauranteId: string,
    image: File,
  ): Promise<string | null> => {
    const formData = new FormData();
    formData.append("image", image);
    try {
      const response = await api.post(
        `/api/backend/restaurante/upload-image/${restauranteId}`,
        formData,
      );
      return response.data.image_url;
    } catch (error: any) {
      console.error("Erro no upload da imagem:", error);
      alert(error.response?.data?.message ||"Falha no upload da imagem do restaurante.");
      return null;
    }
  }, []);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requestBody = {
      nome: formList.nome, // Nome fantasia do restaurante (preenchido na 1ª etapa, pode vir da API)
      descricao: formList.descricao,
      email: formList.email,
      cnpj: formList.cnpj.replace(/\D/g, ""), // CNPJ limpo
      razao_social: formList.nomeFantasia, // Campo 'Nome Fantasia (Consultado)' da 3ª etapa, que também é preenchido pela API
      especialidade: formList.especialidade,
      telefone: formList.telefone.replace(/\D/g, ""),
      horario_funcionamento: formList.horario_funcionamento,
      banco: formList.banco,
      agencia: formList.cAgencia,
      nro_conta: formList.cCorrente,
      tipo_conta: "corrente", // Assumindo tipo fixo, ou adicione ao formulário
      endereco: {
        logradouro: formList.endereco,
        bairro: formList.bairro,
        cidade: formList.cidade,
        estado: formList.estado,
        pais: "Brasil", // Assumindo fixo
        numero: parseInt(formList.numero) || 0, // Tratar caso não seja um número válido
        complemento: formList.complemento,
        cep: formList.cep.replace(/\D/g, ""), // CEP limpo
      },
    };

    try {
      const response = await api.post("/api/backend/restaurante", { data: requestBody });
      const token = response.data.properties?.token;
      if (!token) {
        throw new Error("Token não recebido do backend.");
      }
      const userData = decodeToken(token);
      const restauranteId = userData?.sub; // 'sub' geralmente é o ID do usuário/entidade

      if (restauranteId && imageFile) {
        await uploadRestauranteImage(restauranteId, imageFile);
      } else if (!imageFile) {
        console.warn("Nenhuma imagem foi selecionada para upload.");
      } else if (!restauranteId) {
        console.error("ID do restaurante não obtido do token. Upload da imagem não realizado.");
      }

      alert("Restaurante cadastrado com sucesso!");
      navigate("/account"); // Ou para a página apropriada
    } catch (error: any) {
      console.error("Erro ao cadastrar restaurante:", error.response?.data || error);
      if (error.response?.status === 409) {
        alert(error.response.data?.message || "Dados já cadastrados (e-mail/CNPJ/endereço).");
      } else {
        alert(error.response?.data?.message || error.response?.data?.error_message || "Erro ao cadastrar restaurante.");
      }
    }
  }, [formList, imageFile, navigate, uploadRestauranteImage]); 
  return {
    formList,
    setFormList,
    styleInput,
    etapa,
    setEtapa,
    validarEmail,
    setCepLimpo,
    isLoadingCep,
    cepError,
    mostrarModal,
    setMostrarModal,
    codigoEnviado,
    handleSubmit,
    setImageFile,
    fetchnomeFantasiaPorCNPJ,
    isLoadingNomeFantasia,
    nomeFantasiaError,
    isNomeRestauranteLocked,
  };
};