import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthUserComponent } from "../../hooks/useAuthUser";
import Button from "../ui/Button";

interface AuthGoogleProps {
  setEtapa: React.Dispatch<React.SetStateAction<"telefone" | "email">>;
  setFormList: React.Dispatch<
    React.SetStateAction<{ email: string; telefone: string }>
  >;
}

export default function AuthGoogle({ setEtapa, setFormList }: AuthGoogleProps) {
  const navigate = useNavigate();
  const { loginUser } = useAuthUserComponent();
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
        const { email } = res.data;
        try {
          await loginUser(email);
        } catch {
          setFormList((prev) => ({ ...prev, email }));
          setEtapa("telefone");
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
