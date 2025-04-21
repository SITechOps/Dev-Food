import { api } from "../connection/axios";

export async function postUser(
  email: string,
  telefone: string,
  setAuth: (token: string) => void
): Promise<string | null> {
  try {
    const loginResp = await api.post("/auth/login", { email });
    const token = loginResp?.data?.properties?.token;
    if (token) {
      setAuth(token);
      return token;
    }
  } catch (loginError: any) {
    try {
      const cadastroResp = await api.post("/auth/create", { data: { email, telefone } });
      const token = cadastroResp?.data?.properties?.token;
      if (token) {
        setAuth(token);
        return token;
      }
    } catch (cadastroError) {
      console.error("Erro ao tentar cadastrar:", cadastroError);
    }
  }

  console.error("Não foi possível autenticar ou cadastrar.");
  return null;
}
