export interface IMeusPedidos {
  Id: string;
  atualizado_em: string;
  data_pedido: string;
  endereco: {
    bairro: string;
    cidade: string;
    complemento: string;
    estado: string;
    logradouro: string;
    numero: number;
  };
  forma_pagamento: string;
  itens: {
    produto: string;
    qtd_itens: number;
    valor_calculado: string;
  }[];
  restaurante: {
    logo: string;
    nome: string;
  };
  status: string;
  tipo_entrega: string;
  valor_total: string;
}
export interface Props {
  tipo: "meuPedido" | "historico";
}
