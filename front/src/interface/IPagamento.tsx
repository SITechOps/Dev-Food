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
	sub_total: number,
	taxa_entrega: number,
	tipo_entrega: string
	itens: IItens[];
}
export interface IItens {
	id_produto: string;
	qtd_itens: string;
	valor_calculado: string;
}

export interface IRespPostPedido {
	id_pedido: string;
	message: string;		
}

export interface ITipoProps {
	icon: ReactNode;
	descricao: string;
	tipo: string;
	tipoSelecionado: string;
	onClick?: () => void;
}

export const statusTipo = {
	pendente: "pendente.",
	processando: "em processamento.",
	aprovado: "aprovado.",
	rejeitado: "rejeitado.",
	cancelado: "cancelado.",
	expirou: "Tempo Finalizado para pagamento",
} as const;

export type StatusChave = keyof typeof statusTipo;


export interface ICreatFormCartao {
	amount: string;
	cardholderEmail: string;
	identificationNumber: string;
	identificationType: string;
	installments: string;
	issuerId: string;
	merchantAccountId: string;
	paymentMethodId: string;
	processingMode: string;
	token: string;
}
export interface ITokenCartao {
	token: string;
	cardholderEmail: string;
	transaction_amount: number;
	installments: number;
	identification_type: string;
	identification_number: string;
	payment_method_id: string;
}

