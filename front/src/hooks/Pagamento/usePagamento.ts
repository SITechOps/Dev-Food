import { api } from "@/connection/axios";
import { useAuth } from "@/contexts/AuthContext";
import { CarrinhoContext } from "@/contexts/CarrinhoContext";
import { IItens, IPedido } from "@/interface/IPagamento";
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
  const idUsuario = userData?.sub;
  const [user, setUser] = useState<IUsuarioCliente>();
  const [loading, setLoading] = useState(true);
  const { quantidadeTotal, atualizarQuantidadeTotal } = useContext(CarrinhoContext);
  const [showModal, setShowModal] = useState(false);
  const [meiosSelecao, setMeiosSelecao] = useState<"site" | "entrega">("site");
  const [selecionado, setSelecionado] = useState<"padrão" | "rápida">("padrão");
  const [etapa, setEtapa] = useState<
    "opcaoPagamento" | "pagePix" | "pageCartao"
  >("opcaoPagamento");
  const [modeloPagamento, setModeloPagamento] = useState<"site" | "entrega">(
    "site",
  );
  const [restaurante, setRestaurante] = useState("");
  const storedCompra = localStorage.getItem("compraAtual");
  const [valoresCarrinho, setValoresCarrinho] = useState({
    subtotal: 0,
    taxaEntrega: 0,
    total: 0,
  });

  useEffect(() => {
    obterEnderecoCliente();
    fetchData();
  }, [idUsuario, token, storedCompra]);

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
        alert("Usuário ou token não encontrado. Não é possível buscar o endereço.")
        console.warn("Usuário ou token não encontrado. Não é possível buscar o endereço.",);
        throw new Error("Usuário ou token não encontrado. Não é possível buscar o endereço.")
      }

      const response = await api.get(`/user/${idUsuario}/enderecos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const endereco = response.data?.data?.attributes?.[0];

      if (
        !endereco.logradouro ||
        !endereco.numero ||
        !endereco.bairro ||
        !endereco.cidade ||
        !endereco.estado ||
        !endereco.pais
      ) {
        navigate("/");
        console.error("Endereço incompleto retornado pela API:", endereco);
        throw new Error(
          "O endereço retornado está incompleto. Verifique os dados cadastrados.",
        );
      }

      const rua = `${endereco.logradouro}, ${endereco.numero}`;
      const complemento = `${endereco.bairro}, ${endereco.cidade}, ${endereco.estado} - ${endereco.pais}`;

      setEndereco({
        rua: rua,
        complemento: complemento,
        id: endereco.id,
      });

      console.log("Endereço definido com sucesso:");
    } catch (error) {
     console.log(" Chamada de obterEnderecoCliente:", error)
    }
  }

	async function getDadosUser() {
		try {
			const { data } = await api.get(`/user/${idUsuario}`);
			const dados = data?.data?.attributes || [];
			setUser(dados);
			return dados;
		} catch (error) {
			console.log("erro getDadoUser:",error)
		}
	}

	async function postPedido(formaPagamento: "pix" | "cartao") {
		try {
			if (!storedCompra) {
				throw new Error("Carrinho não encontrado. Adicione itens antes de prosseguir.");
			}

			const compra = JSON.parse(storedCompra);
			const pedidoPayload: IPedido = construirPedidoPayload(compra, formaPagamento);
			const resp = await api.post("/pedido", { pedido: pedidoPayload });
			console.log("resp",resp)

			if (resp.status === 201) {
				setLoading(false);
				localStorage.removeItem("quantidadeTotal");
				localStorage.removeItem("compraAtual");
				localStorage.removeItem("carrinho");
				atualizarQuantidadeTotal();
				navigate("/historico");
				new AppSuccess("Pedido realizado com sucesso! Obrigado por comprar conosco.");
			}
		} catch (error) {
			console.log("erro postPedido:", error)
		}
	}

	function construirPedidoPayload(compra: any, formaPagamento: "pix" | "cartao"): IPedido {
		return {
			id_usuario: userData?.sub,
			id_restaurante: compra.itens[0]?.restaurante.id,
			id_endereco: endereco.id,
			valor_total: compra.total,
			forma_pagamento: formaPagamento,
			itens: compra.itens.map((item: any): IItens => ({
				id_produto: item.id,
				qtd_itens: item.quantidade,
				valor_calculado: item.subtotal,
			})),
		};
	}

	return {
		userData,
		navigate,
		restaurante,
		valoresCarrinho,
		setLoading,
		setValoresCarrinho,
		meiosSelecao,
		setMeiosSelecao,
		selecionado,
		setSelecionado,
		endereco,
		etapa,
		setEtapa,
		modeloPagamento,
		setModeloPagamento,
		postPedido,
		getDadosUser,
	}
}
