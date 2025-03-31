import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function CadastroRestaurante() {
  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <form className="h-120 w-150 rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1>Que bom te ver por aqui!</h1>
          <p className="mt-2">
            As informações abaixo serão usadas para iniciar o cadastro do seu
            restaurante
          </p>
          <div className="mt-8 text-left">
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
            <br />
            <label
              htmlFor="celular"
              className="block font-medium text-gray-700"
            >
              Celular*
            </label>
            <Input
              id="celular"
              name="celular"
              placeholder="(00) 00000-0000"
              value={celular}
              onChange={setCelular}
              type="number"
            />
            <br />
            <label htmlFor="email" className="block font-medium text-gray-700">
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
            <p className="mt-4">Para ajustar, volte para tela anterior</p>
          </div>
        </form>
        <br></br>
        <p>
          Esse site é protegido pelo reCAPTCHA e está sujeito à Política de
          Privacidade
        </p>
        <p> e aos Termos de Serviço do Google</p>

        <Button className="mt-6 ml-200 w-48">Continuar</Button>
      </div>
    </div>
  );
}
