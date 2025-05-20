import { useNavigate } from "react-router-dom";
import { api } from "../connection/axios";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { IRestaurante } from "@/interface/IRestaurante";
import { showError, showInfo, showSuccess } from "@/components/ui/AlertasPersonalizados/toastAlerta";

export const useRestaurantAccount = () => {
  const { logout, userData } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const idRestaurante = userData?.sub;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);

  const restaurantEnderecoFields = [
    { label: "Logradouro", name: "logradouro", type: "text" },
    { label: "Bairro", name: "bairro", type: "text" },
    { label: "Cidade", name: "cidade", type: "text" },
    { label: "Estado", name: "estado", type: "text" },
    { label: "País", name: "pais", type: "text" },
    { label: "Número", name: "numero", type: "number" },
    { label: "Complemento", name: "complemento", type: "text" },
  ];

  const restaurantBankFields = [
    { label: "Banco:", name: "banco", type: "text" },
    { label: "Agência:", name: "agencia", type: "text" },
    { label: "Número da Conta:", name: "nro_conta", type: "text" },
    { label: "Tipo de Conta:", name: "tipo_conta", type: "text" },
  ];

  const restaurantFormFields = [
    { label: "Nome:", name: "nome", type: "text" },
    {
      label: "Telefone:",
      name: "telefone",
      type: "tel",
      isFormatted: true,
      format: "(##) #####-####",
    },
    { label: "Email:", name: "email", type: "email" },
    { label: "Descrição:", name: "descricao", type: "text" },
    { label: "Especialidade:", name: "especialidade", type: "text" },
    {
      label: "Horário de Funcionamento:",
      name: "horario_funcionamento",
      type: "text",
    },
    { label: "Razão Social:", name: "razao_social", type: "text" },
    {
      label: "CNPJ:",
      name: "cnpj",
      type: "text",
      isFormatted: true,
      format: "##.###.###/####-##",
    },
  ];

  const [formListEndereco, setFormListEndereco] = useState({
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
    pais: "",
    numero: "",
    complemento: "",
    tipo: null,
  });

  const [formList, setFormList] = useState({
    nome: "",
    telefone: "",
    email: "",
    descricao: "",
    cnpj: "",
    especialidade: "",
    horario_funcionamento: "",
    razao_social: "",
  });

  const [formListBancario, setFormListBancario] = useState({
    banco: "",
    agencia: "",
    nro_conta: "",
    tipo_conta: "",
  });

  async function fetchUserData() {
    setIsLoading(true);
    try {
      const response = await api.get(`/restaurante/${idRestaurante}`);
      const respRestaurante = response.data?.data?.attributes || [];
      const enderecoRestaurante = respRestaurante.endereco || {};
      const logo = respRestaurante.logo || null;
      setRestaurantLogo(logo);

      setFormList({
        nome: respRestaurante.nome || "",
        telefone: respRestaurante.telefone || "",
        email: respRestaurante.email || "",
        descricao: respRestaurante.descricao || "",
        cnpj: respRestaurante.cnpj || "",
        especialidade: respRestaurante.especialidade || "",
        horario_funcionamento: respRestaurante.horario_funcionamento || "",
        razao_social: respRestaurante.razao_social || "",
      });

      setFormListBancario({
        banco: respRestaurante.banco || "",
        agencia: respRestaurante.agencia || "",
        nro_conta: respRestaurante.nro_conta || "",
        tipo_conta: respRestaurante.tipo_conta || "",
      });

      setFormListEndereco({
        logradouro: enderecoRestaurante.logradouro || "",
        bairro: enderecoRestaurante.bairro || "",
        cidade: enderecoRestaurante.cidade || "",
        estado: enderecoRestaurante.estado || "",
        pais: enderecoRestaurante.pais || "",
        numero: enderecoRestaurante.numero?.toString() || "",
        complemento: enderecoRestaurante.complemento || "",
        tipo: null,
      });
    } catch (error) {
      showError("Erro ao buscar restaurante:");
      console.error("Erro ao buscar restaurante:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function alterarDadosRestaurante(
    id: string,
    restaurante: Partial<Omit<IRestaurante, "id">>,
    imageFile?: File | null,
  ) {
    try {
      setIsEditing(true);
      const formData = new FormData();

      formData.append(
        "data",
        JSON.stringify({
          nome: restaurante.nome,
          telefone: String(restaurante.telefone),
          email: String(restaurante.email),
          descricao: restaurante.descricao,
          especialidade: restaurante.especialidade,
          horario_funcionamento: restaurante.horario_funcionamento,
          razao_social: restaurante.razao_social,
          cnpj: restaurante.cnpj,
        }),
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.patch(`/restaurante/${id}`, formData);
      fetchUserData();
      setIsEditing(false);
    } catch (error) {
      showError("Erro ao editar restaurante:");
      console.error("Erro ao editar restaurante:", error);
    }
  }

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!idRestaurante) {
      showInfo("ID do restaurante não encontrado.");
      return;
    }
    await alterarDadosRestaurante(idRestaurante, formList, imageFile);
  };

  async function alterarDadosBancarios(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await api.patch(`/restaurante/${idRestaurante}/financeiro`, {
        data: formListBancario,
      });
      showSuccess("Dados bancários alterados com sucesso!");
      setIsEditing(false);
    } catch (error) {
      showError("Erro ao alterar dados bancários. Tente novamente.");
    }
    fetchUserData();
  }

  async function alterarEnderecoRestaurante(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!idRestaurante) {
      showInfo(
        "ID do restaurante não encontrado. Tente recarregar a página ou fazer login novamente.",
      );
      return;
    }

    const payload = {
      ...formListEndereco,
      tipo: null,
      numero: formListEndereco.numero
        ? parseInt(formListEndereco.numero.toString(), 10)
        : null,
    };
    console.log("payload", payload);
    try {
      await api.put(`/restaurante/endereco/${idRestaurante}`, {
        data: {
          attributes: payload,
        },
      });

      showSuccess("Endereço atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      showError("Erro ao atualizar o endereço. Tente novamente.");
    }
  }

  async function deletarDados() {
    try {
      await api.delete(`/restaurante/${idRestaurante}`);
      showSuccess("restaurante removido com sucesso!");
      localStorage.clear();
      navigate("/auth");
    } catch (error) {
      console.error(error);
      showError("Erro ao deletar restaurante. Tente novamente.");
    }
  }

  function handleLogout() {
    localStorage.clear();
    logout();
    navigate("/Auth");
  }

  useEffect(() => {
    if (!idRestaurante) return;
    fetchUserData();
  }, [idRestaurante]);

  return {
    navigate,
    formList,
    setFormList,
    formListBancario,
    setFormListBancario,
    restaurantFormFields,
    restaurantBankFields,
    formListEndereco,
    setFormListEndereco,
    restaurantEnderecoFields,
    isEditing,
    setIsEditing,
    isLoading,
    idRestaurante,
    imageFile,
    setImageFile,
    restaurantLogo,
    setRestaurantLogo,
    handleLogout,
    deletarDados,
    alterarDadosRestaurante,
    handleEditSubmit,
    alterarDadosBancarios,
    alterarEnderecoRestaurante,
  };
};
