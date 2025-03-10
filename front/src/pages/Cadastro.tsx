import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../componentes/Button";
import Input from "../componentes/Input";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from '@react-oauth/google';

export default function Cadastro() {

  //google messages handlers
  const responseMessage = (response) => {
    console.log(response);
  };
  const errorMessage = (error) => {
      console.log(error);
  };
  const [ user, setUser ] = useState([]);
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

  //login com o google
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  function handleSubmit() {
    localStorage.setItem("nomeUsuario", nome);
    localStorage.setItem("nomeEmail", email);

    if (validarCampos()) {
      navigate("/account");
    }
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
      <div className="items-center justify-center flex w-full">
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      </div>
    </form>
  );
}


