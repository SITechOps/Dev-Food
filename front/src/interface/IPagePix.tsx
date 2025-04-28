import { ReactNode } from "react";

export interface IPagePix {
	id: string;
	qr_code: string;
	qr_code_base64: string;
}

export interface ITipoProps {
	icon: ReactNode;
	descricao: string;
	tipo: string;
	tipoSelecionado: string; 
	onClick?: () => void;
  }