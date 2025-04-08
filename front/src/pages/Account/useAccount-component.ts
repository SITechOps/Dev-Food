import { useNavigate } from "react-router-dom";
import { api } from "../../connection/axios";
import { FormEvent, useEffect, useState } from "react";
import { decodeToken } from "../../utils/decodeToken";

export const useAccountComponent = () => {
  const navigate = useNavigate();
  const [formList, setFormList] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
  const token = localStorage.getItem("token");
  const [isEditing, setIsEditing] = useState(false);
  const idUsuario = token ? decodeToken(token)?.sub : undefined;

  useEffect(() => {
    if (!idUsuario) return;
    fetchUserData();
  }, [idUsuario]);

  async function fetchUserData() {
    try {
      const response = await api.get(`/user/${idUsuario}`);
      const respUser = response.data?.data?.attributes || [];
      console.log(respUser);
      setFormList({
        nome: respUser.nome || "",
        email: respUser.email || "",
        telefone: respUser.telefone || "",
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  }

  async function alterarDados(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await api.put(`/user/${idUsuario}`, { data: formList });
      alert("Usuário alterado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      alert("Erro ao alterar usuário. Tente novamente.");
    }

    fetchUserData();
  }

  async function deletarDados() {
    try {
      await api.delete(`/user/${idUsuario}`);
      alert("Usuário removido com sucesso!");

      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar usuário. Tente novamente.");
    }
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/Auth");
  }

  return {
    navigate,
    formList,
    setFormList,
    isEditing,
    setIsEditing,
    idUsuario,
    handleLogout,
    deletarDados,
    alterarDados,
  };
};
