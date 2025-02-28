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

  function handleSubmit() {
    console.log('oie')
    localStorage.setItem("nomeUsuario", nome);
    localStorage.setItem("nomeEmail", email);

    if (validarCampos()) {
      navigate("/home");
    }
  }

  return (
    <form className="space-y-4 p-8 mt-6 bg-white rounded-md shadow flex flex-col w-100" onSubmit={handleSubmit}>
       <legend className="text-center">
        Falta pouco para matar sua fome!
      </legend>
      <Input label="Informe o seu nome:" id="nome" type="text" value={nome} placeholder={"Fulando de tal"} onChange={setNome} />
      <Input label="Informe o seu email:" id="email" type="email" value={email} placeholder={"fulando@exemplo.com"} onChange={setEmail} />
      <Input label="Informe sua Senha:" id="senha" type="text" value={senha} onChange={setSenha} />

      <Button variant="filled" onClick={handleSubmit} >
        Continuar
      </Button>
    </form>
  );
}


