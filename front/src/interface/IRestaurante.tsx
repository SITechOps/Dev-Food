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

export const restauranteProps: IRestaurante = {
  nome: "",
  descricao: "",
  especialidade: "",
  endereco: {
    id: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
    pais: "",
    numero: 0,
    tipo: "",
    complemento: "",
  },
  horario_funcionamento: "",
  agencia: "",
  banco: "",
  cnpj: "",
  email: "",
  id: "",
  logo: "",
  nro_conta: "",
  razao_social: "",
  telefone: "",
  tipo_conta: "",
};

