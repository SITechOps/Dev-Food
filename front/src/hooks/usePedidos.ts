import { useEffect, useState } from "react";
import { api } from "../connection/axios";
import { IPedido } from "../interface/IPedidos";

export function usePedidos(idRestaurante?: string) {
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPedidos, setTotalPedidos] = useState<number>(0); // Estado para totalPedidos

  function formatarData(data: string | undefined) {
    if (!data) return "";

    const date = new Date(data);

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      hour12: false,
    }).format(date);
  }

  function calcularDiferencaTempo(data: string | undefined) {
    if (!data) return "";

    data = formatarData(data);

    const [dataParte, horaParte] = data.split(", ");
    const [dia, mes, ano] = dataParte.split("/");
    const [hora, minuto] = horaParte.split(":");

    const dataPedido = new Date(
      Number(ano),
      Number(mes) - 1,
      Number(dia),
      Number(hora),
      Number(minuto),
      0,
      0,
    );

    const agora = new Date();

    if (isNaN(dataPedido.getTime())) {
      return "Erro na conversão da data.";
    }

    const diffMs = agora.getTime() - dataPedido.getTime();
    const diffMinutosTotal = Math.floor(diffMs / (1000 * 60));

    const dias = Math.floor(diffMinutosTotal / (60 * 24));
    const horas = Math.floor((diffMinutosTotal % (60 * 24)) / 60);
    const minutos = diffMinutosTotal % 60;

    if (dias > 0) {
      return `${dias}d${horas}h${minutos}min`;
    } else if (horas > 0) {
      return `${horas}h${minutos}min`;
    } else {
      return `${minutos}min`;
    }
  }

  useEffect(() => {
    if (!idRestaurante) return;

    const fetchPedidos = async () => {
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
        setTotalPedidos(pedidosFormatados.length);
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
        setError("Erro ao buscar pedidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [idRestaurante]);

  useEffect(() => {
    if (!loading) {
      console.log(totalPedidos);
    }
  }, [loading, totalPedidos]);

  return {
    totalPedidos,
    pedidos,
    loading,
    error,
    calcularDiferencaTempo,
    formatarData,
  };
}
