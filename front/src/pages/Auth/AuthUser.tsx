import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthGoogle from "../../components/Auth/AuthGoogle";
import AuthFacebook from "../../components/Auth/AuthFacebook";
import ModalCodigoVerificacao from "../../components/shared/ModalCodigoVerificacao";
import { PatternFormat, NumberFormatValues } from "react-number-format";
import { useAuthUserComponent } from "../../hooks/useAuthUser";
import IconAction from "@/components/ui/IconAction";
import { SetStateAction } from "react";

export default function AuthUser() {
  const {
    validarEmail,
    validarTelefone,
    formList,
    setFormList,
    isModalOpen,
    setIsModalOpen,
    codigoEnviado,
    etapa,
    setEtapa,
    loginUser,
    createUser,
  } = useAuthUserComponent();

  return (
    <>
      <div className="m-auto flex w-full flex-col items-center justify-center pt-10">
        <div className="card mt-12 flex max-w-96 flex-col gap-2 space-y-4 shadow">
          {isModalOpen && (
            <ModalCodigoVerificacao
              qtd_digitos={6}
              codigoEnviado={codigoEnviado}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              tipoEnvioCodigo={etapa}
              onSuccess={async () => {
                try {
                  await loginUser(formList.email);
                } catch {
                  setEtapa("telefone");
                }
              }}
            />
          )}

          {etapa === "telefone" && (
            <IconAction className="mb-5" onClick={() => setEtapa("email")} />
          )}

          <div className="text-center">
            <h1 className="mt-4 font-bold">Falta pouco para matar sua fome!</h1>

            <legend className="mt-4">Como deseja continuar?</legend>
          </div>

          {etapa === "email" && (
            <div className="text-center">
              <div className="mb-4 flex gap-4">
                <AuthGoogle setEtapa={setEtapa} setFormList={setFormList} />
                <AuthFacebook setEtapa={setEtapa} setFormList={setFormList} />
              </div>
              <span className="text-gray-medium">
                -------------- ou --------------
              </span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (etapa === "telefone") {
                createUser(formList.nome, formList.email, formList.telefone);
              }
            }}
          >
            {etapa === "email" && (
              <>
                <Input
                  textLabel="Informe o seu email:"
                  id="email"
                  type="email"
                  value={formList.email}
                  placeholder="exemplo@email.com"
                  onChange={(value) =>
                    setFormList({ ...formList, email: value })
                  }
                  className="mb-6"
                />

                <Button
                  type="button"
                  onClick={validarEmail}
                  disabled={!formList.email}
                >
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
                  value={formList.telefone}
                  onValueChange={(values: NumberFormatValues) =>
                    setFormList((prev) => ({ ...prev, telefone: values.value }))
                  }
                  placeholder="(XX) 99999-9999"
                  className="input mb-6"
                  type="tel"
                  id="telefone"
                  required
                />
                <p className="mb-4">
                  Preencha o telefone, esse campo é obrigatório!
                </p>
                <div className="flex gap-4">
                  <Button
                    color="secondary"
                    type="button"
                    className="p-2"
                    onClick={validarTelefone}
                  >
                    Validar Telefone
                  </Button>
                  <Button
                    type="submit"
                    className="p-2"
                    disabled={
                      !formList.telefone || formList.telefone.length < 11
                    }
                  >
                    Entrar
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
