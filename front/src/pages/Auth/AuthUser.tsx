import Input from "../../components/Input";
import { FaAngleLeft } from "react-icons/fa6";
import Menu from "../../components/Menu";
import Button from "../../components/Button";
import AuthGoogle from "../../components/AuthGoogle";
import AuthFacebook from "../../components/AuthFacebook";
import ModalEmail from "../../components/ModalEmail";
import { PatternFormat, NumberFormatValues } from 'react-number-format';
import { useAuthUserComponent } from "./useAuthUser-component";

export default function AuthUser() {
  const {handleContinuar,
		telefone,
		setTelefone,
		email, 
		setEmail,
		isModalOpen, 
		setIsModalOpen,
		codigoEnviado,
		etapa, 
		setEtapa,
		loginUser} = useAuthUserComponent();

  return (
    <>
      <Menu />
      <div className="m-auto flex w-full flex-col items-center justify-center pt-10">

        <div className="card mt-12 flex max-w-96 flex-col gap-2 space-y-4 shadow">
          {isModalOpen && (
            <ModalEmail
              email={email}
              telefone={telefone}
              codigoEnviado={codigoEnviado}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          )}

          {etapa === "telefone" && (
            <button onClick={() => setEtapa("email")} className="mb-5 self-start">
              <FaAngleLeft className="icon" />
            </button>
          )}

          <div className="text-center">
            <h1 className="mt-4 font-bold">Falta pouco para matar sua fome!</h1>

            <legend className="mt-4 mb-3">
              Como deseja continuar?
            </legend>
          </div>
          
          {etapa === "email" && (
            <div className="text-center">
              <div className="flex gap-4 mb-4">
                <AuthGoogle />
                <AuthFacebook />
              </div>
              <span className="text-gray-medium">
                -------------- ou --------------
              </span>
            </div>
          )}

          <form onSubmit={etapa === "telefone" ? loginUser : undefined}>
            {etapa === "email" && (
              <>
                <Input
                  textLabel="Informe o seu email:"
                  id="email"
                  type="email"
                  value={email}
                  placeholder="exemplo@email.com"
                  onChange={setEmail}
                  className="mb-6"
                />

                <Button type="button" onClick={handleContinuar} disabled={!email}>
                  Continuar
                </Button>
              </>
            )}

            {etapa === "telefone" && (
              <>
                <PatternFormat
                  format="(##) #####-####"
                  mask="_"
                  allowEmptyFormatting
                  value={telefone}
                  onValueChange={(values: NumberFormatValues) => setTelefone(values.value)}
                  placeholder="(XX) 99999-9999"
                  className="input mb-6"
                  type="tel"
                  id="telefone"
                />
                <Button type="submit">
                  Entrar
                </Button>
              </>
            )}

          </form>
        </div>
      </div>
    </>
  );
}
