import { IRestaurante } from "./IRestaurante";

export interface ProductProps{
  id: string,
  nome: string,
  descricao: string,
  imageUrl: string,
  valor_unitario: number,
}

export interface CardProdutosProps extends ProductProps {
  dadosRestaurante: IRestaurante;
}