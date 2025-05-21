import { IRestaurante } from "./IRestaurante";

export interface IProduto {
  id: string;
  nome: string;
  descricao: string;
  qtd_estoque?: number;
  image_url: string;
  valor_unitario: number;
  id_restaurante?: string;
}

export interface CardProdutosProps extends IProduto {
  dadosRestaurante: IRestaurante;
}
