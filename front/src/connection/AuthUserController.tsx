import { api } from "../connection/axios";

export async function postUser(
  email: string,
  telefone: string,
  setAuth: (token: string) => void,
): Promise<string | null> {
  try {
    const resp = await api.post("/user", { data: { email, telefone } });
    const token = resp?.data?.properties?.token;

    if (!token) {
      throw new Error("Token não recebido na resposta.");
    }
    setAuth(token);

    return token;
  } catch (error) {
    console.error(
      "Ocorreu um erro ao tentar cadastrar. Tente novamente.",
      error,
    );
    return null;
  }
}
