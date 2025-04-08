import { api } from "../connection/axios";
import { decodeToken } from "../utils/decodeToken";

export async function postUser(email: string, telefone: string): Promise<string | null> {
	try {
		const resp = await api.post("/user", {
			data: { email, telefone },
		});

		const token = resp?.data?.properties?.token;
		
		if (token) {
			localStorage.setItem("token", token);
		}
		
		const userData = decodeToken(token);

		if (!userData?.sub) {
			throw new Error("ID do usuário não encontrado no token.");
		}

		return token ?? null;
	} catch (error) {
		console.error("Não foi possivél te cadastrar, tente novamente", error);
		return null;
	}
}

