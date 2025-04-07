import Input from "../components/Input";
import { api } from "../connection/axios";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";
import { useState, FormEvent } from "react";
import Menu from "../components/Menu";
import Button from "../components/Button";
import { decodeToken } from "../utils/decodeToken";
import AuthGoogle from "../components/AuthGoogle";
import AuthFacebook from "../components/AuthFacebook";

export default function Auth() {
  const navigate = useNavigate();
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [etapa, setEtapa] = useState<"email" | "celular">("email");

  async function loginUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const resp = await api.post("/login", {
        data: {
          email,
          celular,
        },
      });

      const token = resp?.data?.properties?.token;
      if (!token) {
        throw new Error("Token não encontrado na resposta da API.");
      }
      localStorage.setItem("token", token);

      const userData = decodeToken(token);

      if (!userData?.sub) {
        throw new Error("ID do usuário não encontrado no token.");
      }
      console.log("Usuário logado:", {
        id: userData.sub,
        email,
      });

      navigate("/");
    } catch (error: any) {
      console.error("Erro no login:", error);
      alert(error.response?.data?.message || "Erro ao fazer login.");
    }
  }

  return (
    <>
      <Menu />
      <div className="m-auto flex w-full flex-col items-center justify-center pt-10">

        <div className="card mt-12 flex max-w-96 flex-col gap-2 space-y-4 shadow">
          {etapa === "celular" && (
            <button onClick={() => setEtapa("email")} className="mb-5 self-start">
              <FaAngleLeft className="icon" />
            </button>
          )}

          <div className="text-center">
            <h1 className="mt-4 font-bold">Falta pouco para matar sua fome!</h1>

            <legend className="mt-4 mb-3">
              Como deseja continuar?
            </legend>
          </div>

          {etapa === "email" && (
            <div className="text-center">
              <div className="flex gap-4 mb-4">
                <AuthGoogle />
                <AuthFacebook />
              </div>
              <span className="text-gray-medium">
                -------------- ou --------------
              </span>
            </div>
          )}
          
          <form onSubmit={loginUser}>
            {etapa === "email" && (
              <>
                <Input
                  textLabel="Informe o seu email:"
                  id="email"
                  type="email"
                  value={email}
                  placeholder="exemplo@email.com"
                  onChange={setEmail}
                  className="mb-6"
                />
                <Button onClick={() => setEtapa("celular")} disabled={!email}>
                  Continuar
                </Button>
              </>
            )}

            {etapa === "celular" && (
              <>
                <Input
                  textLabel="Informe o seu celular:"
                  id="celular"
                  type="tel"
                  value={celular}
                  placeholder="(XX)99999-9999"
                  onChange={setCelular}
                  className="mb-6"
                />
                <Button type="submit" disabled={!celular}>
                  Entrar
                </Button>
              </>
            )}
          </form>


        </div>
      </div>
    </>
  );
}
