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
import ModalEmail from "../components/ModalEmail";
import { PatternFormat, NumberFormatValues } from 'react-number-format';


export default function AuthUser() {
  const navigate = useNavigate();
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [codigoEnviado, setCodigoEnviado] = useState("");
  const [etapa, setEtapa] = useState<"email" | "telefone">("email");

  async function handleContinuar() {
    setIsModalOpen(true);

    try {
      const response = await api.post("/send-email", {
        data: { email },
      });
      setCodigoEnviado(response.data.properties.verificationCode);

    } catch (error) {
      console.error("Erro ao enviar email:", error);
      alert("Erro ao enviar email.");
    }
    setEtapa("telefone");
  }

  async function loginUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const resp = await api.post("/user", {
        data: {
          email,
          telefone,
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
          {isModalOpen && (
            <ModalEmail
              email={email}
              telefone={telefone}
              codigoEnviado={codigoEnviado}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          )}

          {etapa === "telefone" && (
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

          <form onSubmit={etapa === "telefone" ? loginUser : undefined}>
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
                <Button type="button" onClick={handleContinuar} disabled={!email}>
                  Continuar
                </Button>
              </>
            )}

            {etapa === "telefone" && (
              <>
                <PatternFormat
                  customInput={Input}
                  format="(##) #####-####"
                  mask="_"
                  allowEmptyFormatting
                  value={telefone}
                  onValueChange={(values: NumberFormatValues) => setTelefone(values.value)}
                  placeholder="(XX) 99999-9999"
                  textLabel="Informe o seu telefone:"
                  id="telefone"
                  className="mb-6"
                />

                <Button type="submit" disabled={!telefone}>
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
