import { useState } from "react";
import { api } from "../../../lib/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import {
  showError,
  showSuccess,
} from "@/shared/components/ui/AlertasPersonalizados/toastAlerta";

export const useAuthUserComponent = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [formList, setFormList] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [codigoEnviado, setCodigoEnviado] = useState("");
  const [etapa, setEtapa] = useState<"email" | "telefone">("email");

  async function validarEmail() {
    setEtapa("email");
    setIsModalOpen(true);
    const response = await api.post("/send-email", {
      data: {
        email: formList.email,
      },
    });
    tratamentoResposta(response);
  }

  async function validarTelefone() {
    setEtapa("telefone");
    setIsModalOpen(true);
    const response = await api.post("/send-sms", {
      data: { telefone: `55${formList.telefone}` },
    });
    tratamentoResposta(response);
  }

  function tratamentoResposta(response: any) {
    try {
      setCodigoEnviado(response.data.properties.verificationCode);
    } catch (error) {
      showError("Erro na tentativa do envio do codigo");
      console.error("Erro na tentativa do envio do codigo:", error);
    }
  }

  async function createUser(nome: string, email: string, telefone: string) {
    try {
      const cadastroResp = await api.post("/auth/create", {
        data: { nome, email, telefone },
      });
      const token = cadastroResp?.data?.properties?.token;
      if (token) {
        setAuth(token);
        navigate("/");
        showSuccess("Cadastro realizado com sucesso!");
      }
    } catch (cadastroError) {
      showError("Erro ao tentar cadastrar");
      console.error("Erro ao tentar cadastrar:", cadastroError);
    }
  }

  async function loginUser(email: string) {
    const loginResp = await api.post("/auth/login", {
      email,
    });
    const token = loginResp?.data?.properties?.token;
    setAuth(token);
    showSuccess("Login realizado com sucesso!");
    navigate("/");
  }
  return {
    validarEmail,
    validarTelefone,
    formList,
    setFormList,
    isModalOpen,
    setIsModalOpen,
    codigoEnviado,
    etapa,
    setEtapa,
    loginUser,
    createUser,
  };
};
