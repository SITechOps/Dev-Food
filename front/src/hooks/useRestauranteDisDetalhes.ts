import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../connection/axios";
import { IRestaurante } from "../interface/IRestaurante";
import { ProductProps } from "../interface/IProduct";


export const useRestauranteDisponiveisDetalhes = () => {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState<IRestaurante>({
    nome: "",
    descricao: "",
    especialidade: "",
    endereco: {
      logradouro: "",
      bairro: "",
      cidade: "",
      estado: "",
      pais: "",
    },
    horario_funcionamento: "",
    gencia: "",
    banco: "",
    cnpj: "",
    email: "",
    id: "",
    logo: "",
    nro_conta: "",
    razao_social: "",
    telefone: "",
    tipo_conta: "",
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [dadosProdutos, setDadosProdutos] = useState<ProductProps[]>([]);

  useEffect(() => {
    getDetalhesRestaurante();
    buscarProdutosByRestaurante();
  }, [id]);

  async function getDetalhesRestaurante() {
    try {
      const response = await api.get(`/restaurante/${id}`);
      setRestaurante(response.data.data.attributes);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar detalhes do restaurante:", error);
      setLoading(false);
    }
  }

  async function buscarProdutosByRestaurante() {
    const response = await api.get(`/restaurante/${id}/produtos`);
    const dadosProdutos = response.data.data.attributes;
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
