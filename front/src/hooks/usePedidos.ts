import { useEffect, useState } from "react";
import { api } from "../connection/axios";

interface Pedido {
  id: string;
  dataPedido: string;
  endereco: {
    bairro: string;
    cidade: string;
    complemento: string;
    estado: string;
    logradouro: string;
    numero: number;
  };
  formaPagamento: string;
  itens: {
    produto: string;
    qtdItens: number;
    valorCalculado: string;
  }[];
  restaurante: {
    logo: string;
    nome: string;
  };
  valorTotal: string;
}

export function usePedidos(idRestaurante?: string) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idRestaurante) return;

    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/restaurante/${idRestaurante}/pedidos`);
        const pedidosApi = response.data.pedidos || [];

        const pedidosFormatados: Pedido[] = pedidosApi.map((pedido: any) => ({
          id: pedido.Id,
          dataPedido: pedido.data_pedido,
          endereco: pedido.endereco,
          formaPagamento: pedido.forma_pagamento,
          itens: pedido.itens,
          restaurante: pedido.restaurante,
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

    fetchPedidos();
  }, [idRestaurante]);

  return { pedidos, loading, error };
}
