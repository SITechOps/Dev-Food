import { useNavigate } from "react-router-dom";
import { api } from "../connection/axios";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const useRestaurantAccount = () => {
  const { logout, userData } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const idRestaurante = userData?.sub;

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
    try {
      const response = await api.get(`/restaurante/${idRestaurante}`);
      const respRestaurante = response.data?.data?.attributes || [];
      const enderecoRestaurante = respRestaurante.endereco || {};

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
      console.error("Erro ao buscar restaurante:", error);
    }
  }

  async function alterarDadosRestaurante(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await api.patch(`/restaurante/${idRestaurante}`, { data: formList });
      alert("Restaurante alterado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      alert("Erro ao alterar restaurante. Tente novamente.");
    }
    fetchUserData();
  }

  async function alterarDadosBancarios(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await api.patch(`/restaurante/${idRestaurante}/financeiro`, {
        data: formListBancario,
      });
      alert("Dados bancários alterados com sucesso!");
      setIsEditing(false);
    } catch (error) {
      alert("Erro ao alterar dados bancários. Tente novamente.");
    }
    fetchUserData();
  }

  async function alterarEnderecoRestaurante(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!idRestaurante) {
      alert(
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

      alert("Endereço atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      alert("Erro ao atualizar o endereço. Tente novamente.");
    }
  }

  async function deletarDados() {
    try {
      await api.delete(`/restaurante/${idRestaurante}`);
      alert("restaurante removido com sucesso!");
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar restaurante. Tente novamente.");
    }
  }

  function handleLogout() {
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
    idRestaurante,
    handleLogout,
    deletarDados,
    alterarDadosRestaurante,
    alterarDadosBancarios,
    alterarEnderecoRestaurante,
  };
};
