export interface ITokenData {
  sub: string; 
  iat: number;  
  exp: number;  
  jti: string;  
  csrf: string; 
  type: string; 
  nbf: number; 
  fresh: boolean; 
}