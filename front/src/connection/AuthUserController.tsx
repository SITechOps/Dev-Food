import { api } from "../connection/axios";

export async function getUser(email: string, telefone: string): Promise<string | null> {
  try {
    const resp = await api.post("/user", {
      data: {
        email,
        telefone,
      },
    });

    const token = resp?.data?.properties?.token;
    return token;
  } catch (error) {
    console.error("Erro ao buscar o usuário:", error);
    return null;
  }
}
