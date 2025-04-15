import { useState, useEffect } from "react";
import { api } from "../connection/axios";
import { useAuth } from "../contexts/AuthContext";
import { IProduto } from "../interface/IProduct";

const useProdutos = () => {
  const { userData } = useAuth();
  const idRestaurante = userData?.sub;
  const [Produtos, setProdutos] = useState<IProduto[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<IProduto | null>(
    null,
  );

  const filteredProducts = Produtos.filter((product) =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  async function listarProdutos() {
    try {
      const response = await api.get(`/restaurante/${idRestaurante}/produtos`);
      setProdutos(response.data?.data?.attributes || []);
      console.log("Listou produtos");
      console.log(response.data?.data?.attributes);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  }

  async function criarProduto(produto: Omit<IProduto, "id">) {
    try {
      await api.post(`/produto`, {
        id_restaurante: idRestaurante,
        data: {
          nome: produto.nome,
          valor_unitario: produto.valor_unitario,
          qtd_estoque: produto.qtd_estoque,
          descricao: produto.descricao,
          imageUrl: produto.imageUrl,
        },
      });
      setSearchTerm("");
      await listarProdutos();
    } catch (error) {
      console.error("Erro ao criar produto:", error);
    }
  }

  async function editarProduto(id: string, produto: Omit<IProduto, "id">) {
    try {
      await api.put(`/produto/${id}`, {
        data: {
          nome: produto.nome,
          valor_unitario: produto.valor_unitario,
          qtd_estoque: produto.qtd_estoque,
          descricao: produto.descricao,
          imageUrl: produto.imageUrl,
        },
      });
      setSearchTerm("");
      await listarProdutos();
    } catch (error) {
      console.error("Erro ao editar produto:", error);
    }
  }

  function deletarProduto(id: string) {
    api
      .delete(`/produto/${id}`)
      .then(() => {
        listarProdutos();
      })
      .catch((error) => {
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

  useEffect(() => {
    if (!idRestaurante) return;

    listarProdutos();
  }, [idRestaurante]);

  return {
    produtos: Produtos,
    produtosFiltrados: filteredProducts,
    deletarProduto,
    criarProduto,
    editarProduto,
    handleSearch,
    isModalOpen,
    abrirModalAdicionar,
    abrirModalEditar,
    fecharModal,
    produtoSelecionado,
  };
};

export default useProdutos;
