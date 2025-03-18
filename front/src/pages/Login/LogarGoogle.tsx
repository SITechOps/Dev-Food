import axios from "axios";
import { api } from "../../connection/axios";
import { useAuth } from "../../connection/AuthContext";
import Button from "../../componentes/Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";


export default function LogarGoogle() {
  const navigate = useNavigate();
  const { setUserLogged } = useAuth();
  const [user, setUser] = useState<TokenResponse | null>(null);

  const loginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
    if (!user) return;
  
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          Accept: "application/json",
        },
      })
      .then(async (res) => {
        setUserLogged(res.data);
  
        const { data } = await api.get("/user");
        const usuarios = data?.data?.attributes || [];
  
        const usuarioEncontrado = usuarios.find((usuario: any) => usuario.email === res.data.email);
  
        usuarioEncontrado
          ? navigate("/account", { state: { profile: res.data } })
          : alert("Você não tem e-mail cadastrado no sistema. Faça seu cadastro.");
      })
      .catch((err) => console.error("Erro ao buscar informações do Google:", err));
  }, [user]);
  
  //   const logOut = () => {
  //     googleLogout();
  //     setProfile(null);
  // };
  return (
        <Button
          variant="filledIcon"
          color="secundary"
          img
          onClick={() => loginGoogle()}
        >
          Fazer login com o Google
        </Button>
  );
}
