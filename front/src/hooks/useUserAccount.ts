import { useNavigate } from "react-router-dom";
import { api } from "../connection/axios";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { showError, showSuccess, showWarning } from "@/components/ui/AlertasPersonalizados/toastAlerta";

export const useUserAccount = () => {
  const navigate = useNavigate();

  const userFormFields = [
    { label: "Nome:", name: "nome", type: "text" },
    {
      label: "Telefone:",
      name: "telefone",
      type: "tel",
      isFormatted: true,
      format: "(##) #####-####",
    },
    { label: "Email:", name: "email", type: "email" },
  ];

  const [userFormList, setUserFormList] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
  const { logout, userData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const idUsuario = userData?.sub;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idUsuario) return;
    fetchUserData();
  }, [idUsuario]);

  async function fetchUserData() {
    try {
      const response = await api.get(`/user/${idUsuario}`);
      const respUser = response.data?.data?.attributes || [];
      setUserFormList({
        nome: respUser.nome || "",
        email: respUser.email || "",
        telefone: respUser.telefone || "",
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showError("Erro ao buscar usuário");
      console.error("Erro ao buscar usuário:", error);
    }
  }

  async function alterarDados(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await api.put(`/user/${idUsuario}`, { data: userFormList });
      showWarning("Usuário alterado com sucesso!");
      setLoading(false);
      setIsEditing(false);
    } catch (error) {
      setLoading(false);
      showError("Erro ao alterar usuário. Tente novamente.");
    }
    fetchUserData();
  }

  async function deletarDados() {
    try {
      await api.delete(`/user/${idUsuario}`);
      showSuccess("Usuário removido com sucesso!");

      localStorage.clear();
      setLoading(false);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setLoading(false);
      showError("Erro ao deletar usuário. Tente novamente.");
    }
  }

  function handleLogout() {
    localStorage.clear();
    logout();
    navigate("/Auth");
  }

  return {
    navigate,
    loading,
    userFormList,
    setUserFormList,
    userFormFields,
    isEditing,
    setIsEditing,
    idUsuario,
    handleLogout,
    deletarDados,
    alterarDados,
  };
};
