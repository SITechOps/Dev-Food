import axios from "axios";
import { api } from "../connection/axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import { AiFillGoogleCircle } from "react-icons/ai";
import Button from "./Button";

export default function AuthGoogle() {
  const navigate = useNavigate();
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
        const respGoogle = res.data;
        const { email, telefone } = respGoogle;
        localStorage.setItem("isGoogle", "true");

        try {
          const response = await api.post("/user", {
            data: {
              email,
              telefone,
            },
          });

          const token = response?.data?.properties?.token;
          if (!token) {
            throw new Error("Token não encontrado na resposta da API.");
          }
          localStorage.setItem("token", token);
          navigate("/");
        } catch (error) {
          console.error("Erro ao processar login/cadastro:", error);
          alert("Erro ao fazer login/cadastro com o Google.");
        }
      })
      .catch((err) =>
        console.error("Erro ao buscar informações do Google:", err),
      );
  }, [user]);

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
