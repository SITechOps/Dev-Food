import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import { AiFillGoogleCircle } from "react-icons/ai";
import Button from "./Button";
import { postUser } from "../connection/AuthUserController";
import { useAuth } from "../contexts/AuthContext";

export default function AuthGoogle() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [user, setUser] = useState<TokenResponse | null>(null);

  const loginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (!user) return;

    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: "application/json",
          },
        },
      )
      .then(async (res) => {
        const { email, telefone } = res.data;

        try {
          const token = await postUser(email, telefone, setAuth);

          if (!token) {
            throw new Error("Token não encontrado na resposta da API.");
          }

          alert("Login realizado com sucesso!");
          navigate("/");
        } catch (error: any) {
          console.error("Erro no login:", error);
          alert(error.response?.data?.message || "Erro ao fazer login.");
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar informações do Google:", err);
      });
  }, [user, setAuth, navigate]);

  return (
    <Button
      color="secondary"
      onClick={() => loginGoogle()}
      className="flex items-center justify-center gap-2 p-2"
    >
      <AiFillGoogleCircle className="size-7" />
      Google
    </Button>
  );
}
