import { api } from "../connection/axios";
import { IPedido } from "../interface/IPedidos";

export function usePedidosFetch() {
  const fetchPedidos = async (
    idRestaurante: string,
    setPedidos: React.Dispatch<React.SetStateAction<IPedido[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    if (!idRestaurante) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/pedidos/restaurante/${idRestaurante}`);
      const pedidosApi = response.data.pedidos || [];

      const pedidosFormatados: IPedido[] = pedidosApi.map((pedido: any) => ({
        id: pedido.Id,
        dataPedido: pedido.data_pedido,
        status: pedido.status,
        tipoEntrega: pedido.tipo_entrega,
        atualizadoEm: pedido.atualizado_em,
        endereco: {
          bairro: pedido.endereco.bairro,
          cidade: pedido.endereco.cidade,
          complemento: pedido.endereco.complemento,
          estado: pedido.endereco.estado,
          logradouro: pedido.endereco.logradouro,
          numero: pedido.endereco.numero,
        },
        formaPagamento: pedido.forma_pagamento,
        itens: pedido.itens.map((item: any) => ({
          produto: item.produto,
          qtdItens: item.qtd_itens,
          valorCalculado: item.valor_calculado,
        })),
        restaurante: {
          logo: pedido.restaurante.logo,
          nome: pedido.restaurante.nome,
        },
        valorTotal: pedido.valor_total,
      }));

      setPedidos(pedidosFormatados);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setError("Erro ao buscar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    idPedido: string,
    novoStatus: string,
    setPedidos: React.Dispatch<React.SetStateAction<IPedido[]>>,
  ) => {
    try {
      await api.patch(`/pedido/status/${idPedido}`, { status: novoStatus });

      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === idPedido ? { ...pedido, status: novoStatus } : pedido,
        ),
      );
      alert("Status do pedido alterado com sucesso!");
    } catch (error) {
      alert("Erro ao alterar status do pedido. Tente novamente.");
    }
  };

  return { fetchPedidos, updateStatus };
}
