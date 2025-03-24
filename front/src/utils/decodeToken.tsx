import { jwtDecode } from "jwt-decode";
import { ITokenData } from "../interface/ITokenData";

export const decodeToken = (token: string): ITokenData | null => {
  if (!token) return null;

  try {
    console.log(jwtDecode<ITokenData>(token))
    return jwtDecode<ITokenData>(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};