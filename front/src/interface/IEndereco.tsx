export interface IEndereco {
  id?: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  numero: number | string;
  tipo?: string;
  complemento?: string;
  cep?: string;
  plain?: () => string;
}
export interface IResponseEndereco {
  type: string;
  count: number;
  attributes: IEndereco[];
}
