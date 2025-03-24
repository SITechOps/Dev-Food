import axios from "axios";
import { api } from "../../connection/axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import Button from "../../componentes/Button";

export default function LogarGoogle() {
  const navigate = useNavigate();
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
        const respGoogle = res.data;

        const { data } = await api.get("/user");
        const usuarios = data?.data?.attributes || [];

        const usuarioEncontrado = usuarios.find((usuario: any) => usuario.email === respGoogle.email);

        if (usuarioEncontrado){
          localStorage.setItem('userLogado', JSON.stringify(usuarioEncontrado));
          navigate("/account");
        }
      })
      .catch((err) => console.error("Erro ao buscar informações do Google:", err));
  }, [user]);

  return (
    <Button
      color="secondary"
      onClick={() => loginGoogle()}
      className="justify-center items-center flex gap-4"
    >
      <img src="img/google.svg" alt="" className="size-4" />
      Fazer login com o Google
    </Button>
  );
}
