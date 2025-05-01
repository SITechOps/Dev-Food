import { IEndereco } from "./IEndereco";

export interface IRestaurante {
	nome: string;
	descricao: string;
	especialidade: string;
	endereco: IEndereco;
	horario_funcionamento: string;
	gencia: string;	
	banco: string;	
	cnpj: string;	
	email: string;	
	id: string;	
	logo: string;	
	nro_conta: string;	
	razao_social: string;	
	telefone: string;	
	tipo_conta: string;	
}
