import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import axios from "axios";
import { decodeToken } from "@/shared/utils/decodeToken";
import {
  showError,
  showInfo,
  showSuccess,
  showWarning,
} from "@/shared/components/ui/AlertasPersonalizados/toastAlerta";

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
      showWarning("Erro na tentativa do envio do codigo");
    }
  }

  const uploadRestauranteImage = async (
    restauranteId: string,
    image: File,
  ): Promise<string | null> => {
    const formData = new FormData();
    formData.append("image", image);
    console.log("Entrou no uploadRestauranteImage");

    try {
      const response = await api.post(
        `/restaurante/upload-image/${restauranteId}`,
        formData,
      );
      // showSuccess("Sucesso no upload da imagem");
      return response.data.image_url;
    } catch (error) {
      showError("Erro no upload da imagem");
      console.error("Erro no upload da imagem:", error);
      return null;
    }
  };

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
            showInfo("CEP não encontrado.");
          }
        })
        .catch((err) => {
          showError("Erro ao buscar o CEP");
          console.error("Erro ao buscar o CEP:", err);
        });
    }
  }, [cepLimpo]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const requestBody = {
      nome: formList.nome,
      descricao: formList.descricao,
      email: formList.email,
      cnpj: formList.cnpj,
      razao_social: formList.razaoSocial,
      especialidade: formList.especialidade,
      telefone: formList.telefone,
      horario_funcionamento: formList.horario_funcionamento,
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
        complemento: formList.complemento,
      },
    };

    try {
      const response = await api.post("/restaurante", { data: requestBody });
      const token = response.data.properties.token;
      const userData = decodeToken(token);
      const restauranteId = userData?.sub;
      if (imageFile) {
        console.log("Chamando upload da imagem...");
        await uploadRestauranteImage(restauranteId!, imageFile);
      } else {
        showInfo("Nenhuma imagem foi selecionada.");
      }

      showSuccess("Restaurante cadastrado com sucesso!");
      return navigate("/account");
    } catch (error: any) {
      if (error.response?.status === 409) {
        showInfo("Esse endereço já foi cadastrado por outro restaurante!");
      }
      showError("Erro ao cadastrar restaurante");
      console.error("Erro ao cadastrar restaurante:", error);
    }
  }

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
    uploadRestauranteImage,
    codigoEnviado,
    setCodigoEnviado,
    handleSubmit,
    imageFile,
    setImageFile,
  };
};
