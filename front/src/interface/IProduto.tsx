import { IRestaurante } from "./IRestaurante";

export interface IProduto {
  id: string;
  id_restaurante?: string;
  nome: string;
  descricao: string;
  qtd_estoque?: number;
  image_url: string;
  valor_unitario: number;
}

export interface CardProdutosProps extends IProduto {
  dadosRestaurante: IRestaurante;
}
