import { ReactNode } from "react";

export interface ICardOpcoesProps {
	icon: ReactNode;
	title: string;
	subtitle: string;
	onClick?: () => void; 
  }
