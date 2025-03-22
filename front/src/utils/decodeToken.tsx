import { jwtDecode } from "jwt-decode";

interface TokenData {
  sub: string; 
  iat: number;  
  exp: number;  
  jti: string;  
  csrf: string; 
  type: string; 
  nbf: number; 
  fresh: boolean; 

}

export const decodeToken = (token: string): TokenData | null => {
  if (!token) return null;

  try {
    return jwtDecode<TokenData>(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};