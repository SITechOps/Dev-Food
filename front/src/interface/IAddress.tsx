export interface Address {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  cep: string;
  plain: () => string;
}
