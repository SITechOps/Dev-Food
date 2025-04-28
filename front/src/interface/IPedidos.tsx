export interface IPedido {
  id?: string;
  valorTotal: number;
  dataPedido: string;
  status: string;
  formaPagamento: string;
  tipoEntrega: string;
  atualizadoEm: string;
  endereco: {
    logradouro: string;
    cidade: string;
    estado: string;
    numero: string;
    complemento?: string;
  };
  itens: {
    produto: string;
    qtdItens: number;
    valorCalculado: number;
  }[];
}
