import CodeInput from "react-code-input";
import { FormEvent, useState } from "react";
import { api } from "../connection/axios";
import Button from "./Button";

interface ModalEmailPros {
  nome: string;
  email: string;
  senha: string;
  codigoEnviado: string;
}

export default function ModalEmail({
  nome,
  email,
  senha,
  codigoEnviado,
}: ModalEmailPros) {
  const [codigoDigitado, setCodigoDigitado] = useState("");

  function validarCodigo(event: FormEvent<HTMLFormElement>) {
    if (codigoDigitado != codigoEnviado) {
      alert("Código inválido!");
    }
    cadastrarUsuario(event);
    alert("Usuário cadastrado com sucesso!");
  }
  async function cadastrarUsuario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await api.post("/user", {
        data: { nome, email, senha },
      });

      const userId = response.data.userInfo.id;

      localStorage.setItem("nomeUsuario", nome || "");
      localStorage.setItem("emailUsuario", email || "");
      localStorage.setItem("senhaUsuario", senha || "");
      localStorage.setItem("userId", userId);

      // if (validarCampos()) {
      //   navigate("/account");
      // }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  }
  return (
    <div className="fixed inset-0 flex h-screen items-center justify-center bg-black/50">
      <div className="modal border-blue flex flex-col items-center gap-6 border-2">
        <div className="flex gap-2">
          <CodeInput
            className="selection:bg-transparent [&_input::-webkit-inner-spin-button]:hidden"
            type="number"
            fields={6}
            onChange={(code) => setCodigoDigitado(code)}
            inputStyle={{
              width: "48px",
              height: "56px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              backgroundColor: "#F3F4F6",
              textAlign: "center",
              fontSize: "1.25rem",
              marginRight: "8px",
            }}
            name={""}
            inputMode={"tel"}
          />
        </div>
        <p className="text-lg">Insira o código enviado por email!</p>
        <Button onClick={() => validarCodigo} className="p-2">
          Confirmar
        </Button>
      </div>
    </div>
  );
}
