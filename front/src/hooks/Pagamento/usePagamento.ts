import { api } from "@/connection/axios";
import { useAuth } from "@/contexts/AuthContext";
import { CarrinhoContext } from "@/contexts/CarrinhoContext";
import { usePagamentoContext } from "@/contexts/PagamaentoContext";
import { useTaxaEntrega } from "@/contexts/TaxaEntregaContext";
import { IItens, IPedido, IRespPedido } from "@/interface/IPagamento";
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
    taxaEntrega: 0,
    total: 0,
  });
  const idUsuario = userData?.sub;
  const [loading, setLoading] = useState(true);
  const [restaurante, setRestaurante] = useState("");
  const [user, setUser] = useState<IUsuarioCliente>();
  const storedCompra = localStorage.getItem("compraAtual");
  const { taxaEntregaSelecionada, tipoEntregaSelecionada } = useTaxaEntrega();
  const { quantidadeTotal, atualizarQuantidadeTotal } =
    useContext(CarrinhoContext);
  const {
    modeloPagamento,
    setModeloPagamento,
    etapa,
    setEtapa,
    resetPagamento,
  } = usePagamentoContext();

  useEffect(() => {
    obterEnderecoCliente();
    if (taxaEntregaSelecionada === 0) {
      navigate("/");
      alert("Não foi encontrado o valor da taxa, para prosseguir.");
    }
    fetchData();
  }, [idUsuario, token, storedCompra, idEndereco]);

  async function fetchData() {
    if (storedCompra) {
      const compra = JSON.parse(storedCompra);
      setRestaurante(compra.itens[0]?.restaurante.nome);
      setValoresCarrinho({
        subtotal: compra.subtotal,
        taxaEntrega: compra.taxaEntrega,
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
      console.log("erro getDadoUser:", error);
    }
  }

  async function postPedido(formaPagamento: "pix" | "cartao") {
    try {
      if (!storedCompra) {
        throw new Error(
          "Carrinho não encontrado. Adicione itens antes de prosseguir.",
        );
      }

      const compra = JSON.parse(storedCompra);
      const pedidoPayload: IPedido = construirPedidoPayload(
        compra,
        formaPagamento,
      );
      const resp = await api.post<{ pedidos: IRespPedido }>("/pedido", {
        pedido: pedidoPayload,
      });

      if (resp.status === 201) {
        setLoading(false);
        new AppSuccess(
          "Pedido realizado com sucesso! Obrigado por comprar conosco.",
        );
        console.log(resp.data);
        postNF(resp.data.pedidos.Id); // falta incluir o id do retorno do pedido
        navigate("/historico");
        localStorage.removeItem("quantidadeTotal");
        localStorage.removeItem("compraAtual");
        localStorage.removeItem("carrinho");
        atualizarQuantidadeTotal();
      }
    } catch (error) {
      console.log("erro postPedido:", error);
      setTimeout(() => {
        resetPagamento();
      }, 0);
    }
  }

  function construirPedidoPayload(
    compra: any,
    formaPagamento: "pix" | "cartao",
  ): IPedido {
    return {
      id_usuario: userData?.sub,
      id_restaurante: compra.itens[0]?.restaurante.id,
      id_endereco: endereco.id,
      valor_total: compra.total,
      sub_total: compra.subtotal,
      taxa_entrega: Number(taxaEntregaSelecionada.toFixed(2)),
      tipo_entrega: tipoEntregaSelecionada,
      forma_pagamento: formaPagamento,
      itens: compra.itens.map(
        (item: any): IItens => ({
          id_produto: item.id,
          qtd_itens: item.quantidade,
          valor_calculado: item.subtotal,
        }),
      ),
    };
  }

  async function postNF(id_pedido: string) {
    try {
      const n_pedido = Number(id_pedido);
      const resp = await api.post("/nota-fiscal", { n_pedido });
      new AppSuccess("Foi gerada uma nota fiscal e encaminhada no seu e-mail");
      return resp;
    } catch (error) {
      setTimeout(() => {
        resetPagamento();
      }, 0);
      console.log("erro postNF:", error);
    }
  }

  return {
    userData,
    navigate,
    restaurante,
    valoresCarrinho,
    setLoading,
    setValoresCarrinho,
    endereco,
    etapa,
    setEtapa,
    modeloPagamento,
    setModeloPagamento,
    postPedido,
    getDadosUser,
    taxaEntregaSelecionada,
  };
};
