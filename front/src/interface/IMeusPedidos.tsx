import { IRestaurante } from "./IRestaurante";
import { IEndereco } from "./IEndereco";
export interface IMeusPedidos {
  Id: number;
  id_usuario: string;
  valor_total: number;
  forma_pagamento: string;
  restaurante?: IRestaurante;
  status?: string;
  itens?: { produto: string; qtd_itens: number; valor: number }[];

  restaurante_nome: string;
  restaurante_logo: string;

  endereco: IEndereco;
  endereco_logradouro: string;
  endereco_numero: string;
  endereco_complemento?: string;
  endereco_bairro: string;
  endereco_cidade: string;
  endereco_estado: string;

  item1_produto: string;
  item1_qtd: number;
  item1_valor: number;
  item2_produto?: string;
  item2_qtd?: number;
  item2_valor?: number;
}

export interface Props {
  tipo: "meuPedido" | "historico";
  pedidos: IMeusPedidos[];
  loading?: boolean; 
}
