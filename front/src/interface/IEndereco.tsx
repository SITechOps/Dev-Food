export interface IEndereco {
	id: string;
	logradouro: string;
	bairro: string;
	cidade: string;
	estado: string;
	pais: string;
	numero: number;
	tipo: string;
	complemento?: string;
}
export interface IResponseEndereco {
	type: string;
	count: number;
	attributes: IEndereco[];
}