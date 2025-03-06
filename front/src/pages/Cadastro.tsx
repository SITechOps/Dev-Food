import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../componentes/Button";
import Input from "../componentes/Input";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const validarCampos = (): boolean => {
    const nomeTrim = nome.trim();
    const emailTrim = email.trim();

    if (nomeTrim === "" || emailTrim === "") {
      alert("Preencha todos os campos!");
      return false;
    }

    return true;
  };

  function fazerLogin(){
    console.log('login realizado')
  }

  function handleSubmit() {
    localStorage.setItem("nomeUsuario", nome);
    localStorage.setItem("nomeEmail", email);

    if (validarCampos()) {
      navigate("/home");
    }
  }

  function cadastroGoogle(){
    console.log('feito o cadastro com o google')
  }

  return (
    <form className="space-y-4 !p-8 !mt-[3rem] bg-white rounded-md shadow flex flex-col w-100" onSubmit={handleSubmit}>
      <legend className="text-center !mb-2">
        Como deseja continuar?
      </legend>
      <div className="w-full">
        <Input label="Informe o seu nome:" id="nome" type="text" value={nome} placeholder={"Fulando de tal"} onChange={setNome} />
        <Input label="Informe o seu email:" id="email" type="email" value={email} placeholder={"fulando@exemplo.com"} onChange={setEmail} />
        <Input label="Informe uma senha:" id="senha" type="text" value={senha} onChange={setSenha} />
      </div>

      <div className="flex justify-end">
        <span className="text-gray-medio">Já tenho conta</span>
        <Button variant="plain" onClick={fazerLogin} className="!w-[6rem] !p-0 !m-0">
          Fazer login
        </Button>
      </div>

      <Button variant="filled" onClick={handleSubmit} className="!mt-5">
        Continuar
      </Button>

      <span className="text-center text-gray-medio mt-4">-------------- OU --------------</span>
      <Button variant="filledIcon" color='secundary' img onClick={cadastroGoogle} className="!mt-6">
        Fazer cadastro com o Google
      </Button>
    </form>
  );
}


