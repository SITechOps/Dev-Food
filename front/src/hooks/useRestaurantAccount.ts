import { useNavigate } from "react-router-dom";
import { api } from "../connection/axios";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const useRestaurantAccountComponent = () => {
  const { logout, userData } = useAuth();
  const navigate = useNavigate();
  const [formList, setFormList] = useState({
    nome: "",
    telefone: "",
    email: "",
    descricao: "",
    agencia: "",
    banco: "",
    cnpj: "",
    especialidade: "",
    horario_funcionamento: "",
    nro_conta: "",
    razao_social: "",
    tipo_conta: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const idRestaurante = userData?.sub;
  console.log(idRestaurante);

  useEffect(() => {
    if (!idRestaurante) return;
    fetchUserData();
  }, [idRestaurante]);

  async function fetchUserData() {
    try {
      const response = await api.get(`/restaurante/${idRestaurante}`);
      const respRestaurante = response.data?.data?.attributes || [];
      console.log(respRestaurante);
      setFormList({
        nome: respRestaurante.nome || "",
        telefone: respRestaurante.telefone || "",
        email: respRestaurante.email || "",
        descricao: respRestaurante.descricao || "",
        agencia: respRestaurante.agencia || "",
        banco: respRestaurante.banco || "",
        cnpj: respRestaurante.cnpj || "",
        especialidade: respRestaurante.especialidade || "",
        horario_funcionamento: respRestaurante.horario_funcionamento || "",
        nro_conta: respRestaurante.nro_conta || "",
        razao_social: respRestaurante.razao_social || "",
        tipo_conta: respRestaurante.tipo_conta || "",
      });
    } catch (error) {
      console.error("Erro ao buscar restaurante:", error);
    }
  }

  async function alterarDados(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await api.put(`/restaurante/${idRestaurante}`, { data: formList });
      alert("restaurante alterado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      alert("Erro ao alterar restaurante. Tente novamente.");
    }

    fetchUserData();
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

  return {
    navigate,
    formList,
    setFormList,
    isEditing,
    setIsEditing,
    idRestaurante,
    handleLogout,
    deletarDados,
    alterarDados,
  };
};
