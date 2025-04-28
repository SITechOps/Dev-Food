import { jwtDecode } from "jwt-decode";
import { ITokenData } from "../interface/ITokenData";

export const decodeToken = (token: string): ITokenData | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<ITokenData>(token);
    if (!decoded.sub || !decoded.role) {
      console.warn("Token inválido: sub ou role ausentes");
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
};
