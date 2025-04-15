import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ModalEmail from "../../components/ModalEmail";
import { useNavigate } from "react-router-dom";
import { api } from "../../connection/axios";

export default function CadastroRestaurante() {
  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [codigoEnviado, setCodigoEnviado] = useState(""); // código simulado enviado por e-mail

  const navigate = useNavigate();

  async function continuarCadastro() {
    setMostrarModal(true);
    try {
      const response = await api.post("/send-email", {
        data: { email },
      });
      setCodigoEnviado(response.data.properties.verificationCode);
    } catch (error) {
      console.error("Erro na tentativa do envio do codigo:", error);
      alert("Erro na tentativa do envio do codigo");
    }
  }

  return (
    <div className="relative flex h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        <form className="h-auto w-96 rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-xl font-bold">Que bom te ver por aqui!</h1>
          <p className="mt-2 text-sm text-gray-600">
            As informações abaixo serão usadas para iniciar o cadastro do seu
            restaurante
          </p>
          <div className="mt-6 space-y-4 text-left">
            <Input
              id="nome"
              name="nome"
              textLabel="Nome Completo:"
              placeholder="Digite seu nome e sobrenome"
              value={nome}
              onChange={setNome}
              type="text"
              required
            />

            <Input
              id="celular"
              name="celular"
              textLabel="Celular:"
              placeholder="(00) 00000-0000"
              value={celular}
              onChange={setCelular}
              type="text"
              required
            />

            <Input
              textLabel="E-mail:"
              id="email"
              name="email"
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={setEmail}
              type="text"
              required
            />

            <p className="mt-4 text-sm text-gray-500">
              Para ajustar, volte para tela anterior
            </p>
          </div>
        </form>

        <p className="mt-4 max-w-sm text-center text-xs text-gray-500">
          Esse site é protegido pelo reCAPTCHA e está sujeito à Política de
          Privacidade e aos Termos de Serviço do Google
        </p>

        <Button
          className="mt-6 w-48"
          type="button"
          disabled={!nome || !celular || !email}
          onClick={continuarCadastro}
        >
          Continuar
        </Button>
      </div>

      {mostrarModal && (
        <ModalEmail
          // email={email}
          codigoEnviado={codigoEnviado}
          isModalOpen={mostrarModal}
          setIsModalOpen={setMostrarModal}
          tipoEnvioCodigo={"email"}
          onSuccess={() => navigate("/dados-restaurante")}
        />
      )}
    </div>
  );
}
