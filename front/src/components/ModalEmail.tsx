import CodeInput from "react-code-input";
import Button from "./Button";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

interface ModalEmailPros {
  email: string;
  telefone: string;
  codigoEnviado: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalEmail({
  codigoEnviado,
  isModalOpen,
  setIsModalOpen,
}: ModalEmailPros) {
  const [codigoDigitado, setCodigoDigitado] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fechar o modal ao clicar fora dele
  useEffect(() => {
    if (!isModalOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!modalRef.current?.contains(event.target as Node)) {
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isModalOpen]);

  function validarCodigo() {
    if (codigoDigitado != codigoEnviado) {
      alert("Código inválido!");
    } else {
      alert("Código confirmado!");
      setIsModalOpen(false);
    }
  }

  function closeModal() {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex h-screen items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="border-blue relative flex flex-col items-center gap-6 rounded-lg border-2 bg-white p-10 pt-12"
      >
        <IoClose
          className="icon absolute top-3 right-4"
          size={26}
          onClick={closeModal}
        />

        <div className="flex gap-2">
          <CodeInput
            className="[&_input::-moz-appearance]:textfield selection:bg-transparent [&_input::-webkit-inner-spin-button]:hidden"
            type="number"
            fields={6}
            onChange={(code) => {
              setCodigoDigitado(code);
              code.length === 6 && buttonRef.current?.focus();
            }}
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
        <Button ref={buttonRef} onClick={() => validarCodigo()} className="p-2">
          Confirmar
        </Button>
      </div>
    </div>
  );
}
