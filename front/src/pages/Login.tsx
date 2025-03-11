import Input from "../componentes/Input";
import Button from "../componentes/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";


export default function Login() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<TokenResponse | null>(null);
  // const [profile, setProfile] = useState<any>(null);
  
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });
  
    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                      console.log('entrou')
                      // setProfile(res.data);
                      navigate("/account", { state: { profile: res.data } });
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );
  //   const logOut = () => {
  //     googleLogout();
  //     setProfile(null);
  // };
  
  const validarCampos = (): boolean => {
    const senhaTrim = senha.trim();
    const emailTrim = email.trim();

    if (senhaTrim === "" || emailTrim === "") {
      alert("Preencha todos os campos!");
      return false;
    }

    return true;
  };

  function botaoContinuar() {
    if (validarCampos()) {
      navigate("/home");
    }
  }

  function botaoCadastro() {
    navigate("/Cadastro");
  }

  // function botaoGoogle() {
  //   navigate("/home");
  // }

  return (
    <div>
      <h1 className="text-3xl text-stone-950 font-bold ml-22 mt-4">
        Faça o seu login
      </h1>

      <form className="space-y-2.5 p-9 !mt-[3rem] bg-white rounded-md shadow flex flex-col w-100">
        <legend className="text-center !mb-2"> Como deseja continuar?</legend>

        <Button
          variant="filledIcon"
          color="secundary"
          img
          onClick={() => login()}
        >
          Fazer login com o Google
        </Button>

        <span className="text-center text-gray-medio mt-4">
          -------------- OU --------------
        </span>

        <div className="w-full">
          <Input
            label="Informe o seu email:"
            id="email"
            type="email"
            value={email}
            placeholder={"fulano@exemplo.com"}
            onChange={setEmail}
          />

          <Input
            label="Informe uma senha:"
            id="senha"
            type="text"
            value={senha}
            onChange={setSenha}
          />
        </div>

        <Button variant="filled" onClick={botaoContinuar}>
          Continuar
        </Button>

        <div className="flex justify-center items-center space-y-2">
          <span className="text-gray-medio"> Não tem conta?</span>
          <Button variant="plain" onClick={botaoCadastro}>
            Cadastre-se
          </Button>
        </div>
      </form>
    </div>
  );
}
