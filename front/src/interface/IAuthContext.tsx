
import { ReactNode } from "react";

export interface IUser {
	nome: string;
	email: string;
	id: number;
	is_admin: boolean;
}

export interface IAuthContextType {
	userLogged: IUser | null;
	setUserLogged: (user: IUser | null) => void;
}

export interface IAuthProviderProps {
	children: ReactNode; 
}
