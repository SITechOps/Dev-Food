import { FormEvent, useState } from "react";
import { api } from "../../connection/axios";
import { postUser } from "../../connection/AuthUserController";
import { useNavigate } from "react-router-dom";

export const useAuthUserComponent = () => {
  const navigate = useNavigate();
  const [formList, setFormList] = useState({
    telefone: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
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
      setLoading(false);
      setCodigoEnviado(response.data.properties.verificationCode);
    } catch (error) {
      console.error("Erro na tentativa do envio do codigo:", error);
      alert("Erro na tentativa do envio do codigo");
    }
  }

  async function loginUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const token = await postUser(formList.email, formList.telefone);

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
  };
};
