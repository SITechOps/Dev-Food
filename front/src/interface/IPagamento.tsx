import { ReactNode } from "react";

export interface IPagePix {
	email_comprador: string;
	nome_comprador: string;
	valor_pagamento: number;
}
export interface IResponsePagePix {
	id: string;
	qr_code: string;
	qr_code_base64: string;
}

export interface IPedido {
	id_usuario?: string;
	id_restaurante: string;
	id_endereco: string;
	valor_total: number;
	forma_pagamento: string;
	itens: IItens[];
}
export interface IItens {
	id_produto: string;
	qtd_itens: string;
	valor_calculado: string;
}

export interface ITipoProps {
	icon: ReactNode;
	descricao: string;
	tipo: string;
	tipoSelecionado: string;
	onClick?: () => void;
}

export const statusTipo = {
	pendente: "Pagamento pendente",
	processando: "Em processamento",
	aprovado: "Pagamento aprovado",
	rejeitado: "Pagamento rejeitado",
	cancelado: "Pagamento cancelado",
	expirou: "Tempo Finalizado para pagamento",
  } as const;
  
  export type StatusChave = keyof typeof statusTipo;
  