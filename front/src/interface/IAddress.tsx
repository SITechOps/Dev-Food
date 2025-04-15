export interface IAddress {
  id?: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  cep: string;
  plain: () => string;
}
