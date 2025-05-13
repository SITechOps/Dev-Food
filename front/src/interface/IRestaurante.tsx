import { IEndereco } from "./IEndereco";

export interface IRestaurante {
  nome: string;
  descricao?: string;
  especialidade: string;
  endereco: IEndereco;
  horario_funcionamento?: string;
  agencia: string;
  banco?: string;
  cnpj: string;
  email: string;
  id: string;
  logo: string;
  nro_conta: string;
  razao_social: string;
  telefone: string;
  distancia?: number | undefined;  
  taxa_entrega?: number | undefined;
  duration?: number | undefined;  
  tipo_conta: string;
}
