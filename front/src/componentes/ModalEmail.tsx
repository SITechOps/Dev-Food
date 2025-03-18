import CodeInput from "react-code-input";
import Button from "./Button";
import { useState } from "react";

export default function ModalEmail() {
  const [codigo, setCodigo] = useState("");
  return (
    <div className="fixed inset-0 flex h-screen items-center justify-center bg-black/50">
      <div className="border-blue flex flex-col items-center gap-6 rounded-lg border-2 bg-white p-10">
        <div className="flex gap-2">
          <CodeInput
            className="selection:bg-transparent [&_input::-webkit-inner-spin-button]:hidden"
            type="number"
            fields={6}
            onChange={(code) => setCodigo(code)}
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
        <Button className="!p-2">Confirmar</Button>
      </div>
    </div>
  );
}
