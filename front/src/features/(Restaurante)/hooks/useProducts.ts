import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { useAuth } from "@/shared/contexts/AuthContext";
import { IProduto } from "@/shared/interfaces/IProduto";
import {
  showError,
  showWarning,
} from "@/shared/components/ui/AlertasPersonalizados/toastAlerta";

const useProdutos = () => {
  const { userData } = useAuth();
  const idRestaurante = userData?.sub;
  const [Produtos, setProdutos] = useState<IProduto[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<IProduto | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const filteredProducts = Produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  async function listarProdutos(callback?: () => void) {
    try {
      const response = await api.get(`/restaurante/${idRestaurante}/produtos`);
      setProdutos(response.data?.data?.attributes || []);
      if (callback) callback();
    } catch (error) {
      showError("Erro ao buscar produtos");
      console.error("Erro ao buscar produtos:", error);
    }
  }

  useEffect(() => {
    if (!idRestaurante) return;
    listarProdutos();
  }, [idRestaurante]);

  async function criarProduto(
    produto: Omit<IProduto, "id">,
    imageFile?: File | null,
  ) {
    try {
      setIsUploading(true);
      const response = await api.post(`/produto`, {
        id_restaurante: idRestaurante,
        data: {
          nome: produto.nome,
          valor_unitario: produto.valor_unitario,
          qtd_estoque: produto.qtd_estoque,
          descricao: produto.descricao,
        },
      });

      const produtoId = response.data.id;

      if (imageFile && produtoId) {
        const formData = new FormData();
        formData.append("image", imageFile);
        await api.post(`/produto/upload-image/${produtoId}`, formData);
      }

      await listarProdutos();
      setSearchTerm("");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      showError("Erro ao criar produto");
    } finally {
      setIsUploading(false);
    }
  }

  async function editarProduto(
    id: string,
    produto: Omit<IProduto, "id">,
    imageFile?: File | null,
  ) {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("nome", produto.nome);
      formData.append("valor_unitario", String(produto.valor_unitario));
      formData.append("qtd_estoque", String(produto.qtd_estoque));
      formData.append("descricao", produto.descricao);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.put(`/produto/${id}`, formData);

      const response = await api.get(`/restaurante/${idRestaurante}/produtos`);
      const updatedProdutos = response.data?.data?.attributes || [];

      setProdutos(updatedProdutos);
      setSearchTerm("");
    } catch (error) {
      showError("Erro ao editar produto");
      console.error("Erro ao editar produto:", error);
    } finally {
      setIsUploading(false);
    }
  }

  function deletarProduto(id: string, nome: string) {
    showWarning(`Deletando Produto: ${nome}`);
    api
      .delete(`/produto/${id}`)
      .then(() => {
        listarProdutos();
      })
      .catch((error) => {
        showError("Erro ao deletar produto");
        console.error("Erro ao deletar produto:", error);
      });
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const abrirModalAdicionar = () => {
    setProdutoSelecionado(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (produto: IProduto) => {
    setProdutoSelecionado(produto);
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setProdutoSelecionado(null);
  };

  return {
    produtos: Produtos,
    produtosFiltrados: filteredProducts,
    deletarProduto,
    criarProduto,
    editarProduto,
    handleSearch,
    isModalOpen,
    isUploading,
    abrirModalAdicionar,
    abrirModalEditar,
    fecharModal,
    produtoSelecionado,
    listarProdutos,
  };
};

export default useProdutos;
