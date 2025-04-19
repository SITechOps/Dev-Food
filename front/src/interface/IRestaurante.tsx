export interface IEndereco {
	logradouro: string;
	bairro: string;
	cidade: string;
	estado: string;
	pais: string;
  }
  
  export interface IRestaurante {
	nome: string;
	descricao: string;
	especialidade: string;
	endereco: IEndereco;
	horario_funcionamento: string;
  }
  