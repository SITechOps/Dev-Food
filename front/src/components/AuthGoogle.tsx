import axios from "axios";
import { api } from "../connection/axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import Button from "./Button";

export default function LogarGoogle() {
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
        const { email, name: nome, id: senha } = respGoogle;
        localStorage.setItem("isGoogle", "true");

        try {
          const response = await api.post(
            "/login",
            {
              data: { email, senha: senha.substring(0, 12) },
            },
            { validateStatus: (status) => status < 500 },
          );

          if (response.status != 404) {
            const token = response.data?.properties.token || [];
            localStorage.setItem("token", JSON.stringify(token));
            navigate("/");
          } else {
            // Usuário não encontrado, criar novo usuário
            const createResponse = await api.post("/user", {
              data: { nome, email, senha: senha.substring(0, 12) },
            });
            const token = createResponse.data.properties.token;

            localStorage.setItem("token", JSON.stringify(token));
            navigate("/");
          }
        } catch (error) {
          console.error("Erro ao processar a requisição:", error);
          alert("Erro ao processar a requisição.");
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
      className="flex items-center justify-center gap-4"
    >
      <img src="img/google.svg" alt="Logo do Google" className="size-4" />
      Entrar com Google
    </Button>
  );
}
