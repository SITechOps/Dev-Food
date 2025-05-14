import { api } from "@/connection/axios";
import { useAuth } from "@/contexts/AuthContext";
import { CarrinhoContext } from "@/contexts/CarrinhoContext";
import { usePagamentoContext } from "@/contexts/PagamaentoContext";
import { useTaxaEntrega } from "@/contexts/TaxaEntregaContext";
import { IItens, IPedido, IRespPostPedido } from "@/interface/IPagamento";
import { IUsuarioCliente } from "@/interface/IUser";
import { AppSuccess } from "@/utils/success";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const usePagamento = () => {
  const { userData, token } = useAuth();
  const navigate = useNavigate();
  const [endereco, setEndereco] = useState({
    rua: "",
    complemento: "",
    id: "",
  });
  const [valoresCarrinho, setValoresCarrinho] = useState({
    subtotal: 0,
    taxa_entrega: 0,
    total: 0,
  });
  const idUsuario = userData?.sub;
  const [isLoading, setIsLoading] = useState(false);
  const [restaurante, setRestaurante] = useState("");
  const [user, setUser] = useState<IUsuarioCliente>();
  const storedCompra = localStorage.getItem("compraAtual");
  const idEndereco = localStorage.getItem("enderecoPadraoId")!;
  const { taxaEntregaSelecionada, tipoEntregaSelecionada } = useTaxaEntrega();
  const { quantidadeTotal, atualizarQuantidadeTotal } = useContext(CarrinhoContext);
  const {
    modeloPagamento,
    setModeloPagamento,
    etapa,
    setEtapa,
    resetPagamento
  } = usePagamentoContext();

  useEffect(() => {
    obterEnderecoCliente();
    if (taxaEntregaSelecionada === 0) {
      navigate("/");
      alert("Não foi encontrado o valor da taxa, para prosseguir.")
    }

    if (!idEndereco) {
      navigate("/");
      alert("Endereço padrão não encontrado no.");
    }

    fetchData();
  }, [idUsuario, token, storedCompra, idEndereco]);


  async function fetchData() {
    if (storedCompra) {
      const compra = JSON.parse(storedCompra);
      setRestaurante(compra.itens[0]?.restaurante.nome);
      setValoresCarrinho({
        subtotal: compra.subtotal,
        taxa_entrega: compra.taxa_entrega,
        total: compra.total,
      });
    }
  }

  async function obterEnderecoCliente() {
    try {
      if (!idUsuario || !token) {
        navigate("/");
        alert("Usuário ou token não encontrado.");
        throw new Error("Usuário ou token não encontrado.");
      }

      const response = await api.get(`/user/${idUsuario}/enderecos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const endereco = response.data?.data?.attributes?.[0];

      if (!endereco) {
        navigate("/");
        alert("Nenhum endereço encontrado.");
        return;
      }

      const rua = `${endereco.logradouro}, ${endereco.numero}`;
      const complemento = `${endereco.bairro}, ${endereco.cidade}, ${endereco.estado} - ${endereco.pais}`;

      setEndereco({
        rua,
        complemento,
        id: endereco.id,
      });

      console.log("Endereço definido com sucesso:", rua, complemento);
    } catch (error) {
      console.error("Erro ao obter endereço:", error);
    }
  }

  async function getDadosUser() {
    try {
      const { data } = await api.get(`/user/${idUsuario}`);
      const dados = data?.data?.attributes || [];
      setUser(dados);
      return dados;
    } catch (error) {
      console.log("erro getDadoUser:", error)
    }
  }

  async function postPedido(formaPagamento: "pix" | "cartao") {
    setIsLoading(true);
    try {
      if (!storedCompra) {
        throw new Error("Carrinho não encontrado. Adicione itens antes de prosseguir.");
      }
      const compra = JSON.parse(storedCompra);
      const pedidoPayload: IPedido = construirPedidoPayload(compra, formaPagamento);
      const resp = await api.post<IRespPostPedido>("/pedido", { pedido: pedidoPayload });

      if (resp.status === 201) {
        postNF(resp.data.id_pedido) 
        localStorage.removeItem("quantidadeTotal");
        localStorage.removeItem("compraAtual");
        localStorage.removeItem("carrinho");
        atualizarQuantidadeTotal();
      }
    } catch (error) {
      console.log("erro postPedido:", error)
      setTimeout(() => {
        resetPagamento(); 
      }, 0);
    }
  }

  function construirPedidoPayload(compra: any, formaPagamento: "pix" | "cartao"): IPedido {
    return {
      id_usuario: userData?.sub,
      id_restaurante: compra.itens[0]?.restaurante.id,
      id_endereco: idEndereco,
      sub_total: compra.subtotal,
      taxa_entrega: Number(taxaEntregaSelecionada.toFixed(2)), 
      valor_total: Number((compra.subtotal + taxaEntregaSelecionada).toFixed(2)),
      tipo_entrega: tipoEntregaSelecionada,
      forma_pagamento: formaPagamento,
      itens: compra.itens.map((item: any): IItens => ({
        id_produto: item.id,
        qtd_itens: item.quantidade,
        valor_calculado: item.subtotal,
      })),
    };
  }

  async function postNF(id_pedido: string){
    setIsLoading(true);
    try {
      const resp = await api.post("/nota-fiscal", { id_pedido });
      new AppSuccess("Pedido realizado com sucesso! Obrigado por comprar conosco.");
      new AppSuccess("Foi gerada uma nota fiscal e encaminhada no seu e-mail");
      setIsLoading(false);
      navigate("/historico");
      return resp;
    } catch (error) {
      setTimeout(() => {
        
      }, 0);
      console.log("erro postNF:", error)
    }
  }

  return {
    userData,
    storedCompra,
    navigate,
    restaurante,
    valoresCarrinho,
    setIsLoading,
    isLoading,
    setValoresCarrinho,
    endereco,
    etapa,
    setEtapa,
    modeloPagamento,
    setModeloPagamento,
    postPedido,
    getDadosUser,
    taxaEntregaSelecionada,
  }
}
