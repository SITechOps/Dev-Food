import Input from "../components/Input";
import { useState } from "react";
import Button from "../components/Button";
import ModalEmail from "../components/ModalEmail";
import { useNavigate } from "react-router-dom";

export default function CadastroRestaurante() {
  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [codigoEnviado,setcodigoEnviado] = useState("123456"); // código simulado enviado por e-mail

  const navigate = useNavigate();

  const validarCampos = () => {
    return nome.trim() !== "" && celular.trim() !== "" && email.trim() !== "";
  };

  const ContinuarClick = () => {
    if (validarCampos()) {
      setMostrarModal(true);
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  };

  const confirmarModal = () => {
    setMostrarModal(false);
    navigate("/dados-restaurante");
  };

  const fecharModal = () => {
    setMostrarModal(false);
  };

  return (
    <div className="relative flex h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        <form className="h-auto w-96 rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-xl font-bold">Que bom te ver por aqui!</h1>
          <p className="mt-2 text-sm text-gray-600">
            As informações abaixo serão usadas para iniciar o cadastro do seu
            restaurante
          </p>
          <div className="mt-6 text-left">
            <label htmlFor="nome" className="block font-medium text-gray-700">
              Nome completo*
            </label>
            <Input
              className="border"
              id="nome"
              name="nome"
              placeholder="Digite seu nome e sobrenome"
              value={nome}
              onChange={setNome}
              type="text"
            />

            <label
              htmlFor="celular"
              className="mt-4 block font-medium text-gray-700"
            >
              Celular*
            </label>
            <Input
              id="celular"
              name="celular"
              placeholder="(00) 00000-0000"
              value={celular}
              onChange={setCelular}
              type="text"
            />

            <label
              htmlFor="email"
              className="mt-4 block font-medium text-gray-700"
            >
              E-mail*
            </label>
            <Input
              className="border"
              id="email"
              name="email"
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={setEmail}
              type="text"
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

        <Button className="mt-6 w-48" type="button" onClick={ContinuarClick}>
          Continuar
        </Button>
      </div>

      {mostrarModal && (
        <ModalEmail
          email={email}
          onConfirm={confirmarModal}
          onClose={fecharModal}
          codigoEnviado={codigoEnviado}
        />
      )}
    </div>
  );
}
