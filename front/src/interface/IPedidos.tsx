export interface IPedido {
  id?: string;
  dataPedido: string;
  status: string;
  tipoEntrega: string;
  atualizadoEm: string;
  codigo?: string;
  cliente?: string;
  endereco: {
    bairro: string;
    logradouro: string;
    cidade: string;
    estado: string;
    numero: string;
    complemento?: string;
  };
  formaPagamento: string;
  itens: Array<{
    produto: string;
    qtdItens: number;
    valorCalculado: number;
  }>;
  restaurante: {
    logo: string;
    nome: string;
  };
  valorTotal: number;
}
