import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { api } from "../../../connection/axios";
import { IProduto } from "@/interface/IProduto";


export const useRestaurante = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [dadosProdutos, setDadosProdutos] = useState<IProduto[]>([]);
  const restaurante = JSON.parse(localStorage.getItem("restauranteSelecionado") || "null");
  const id = JSON.parse(localStorage.getItem("idRestaurante") || "null");

  useEffect(() => {
    if (restaurante) {
      buscarProdutosByRestaurante();
    }
  }, []);

  async function buscarProdutosByRestaurante() {
    const response = await api.get(`/restaurante/${id}/produtos`);
    const dadosProdutos = response.data.data.attributes;
    setLoading(false);
    setDadosProdutos(dadosProdutos);
  }
  
  return {
    restaurante,
    navigate,
    loading,
    setLoading,
    isModalOpen,
    setIsModalOpen,
    dadosProdutos,
  };
};
