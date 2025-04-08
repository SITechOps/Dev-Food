import { FaAngleLeft } from "react-icons/fa6";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Menu from "../../components/Menu";
import ListagemEndereco from "../../components/ListagemEndereco";
import { NumberFormatValues, PatternFormat } from "react-number-format";
import { useAccountComponent } from "./useAccount-component";

export default function Account() {
  const {
    navigate,
    nome,
    setNome,
    email,
    telefone,
    setTelefone,
    isEditing,
    setIsEditing,
    idUsuario,
    handleLogout,
    deletarDados,
    alterarDados } = useAccountComponent();
  const baseText = "text-blue mt-3 flex items-center justify-start gap-2 p-0 text-lg";

  if (!idUsuario) {
    return (
      <section className="flex h-screen flex-col items-center justify-center">
        <h2 className="font-bold">Acesso negado</h2>
        <p className="mt-2">
          Faça login ou cadastre-se para acessar sua conta.
        </p>
        <div className="mt-5 flex w-[40rem] gap-4">
          <Button onClick={() => navigate("/Auth")}>Fazer Login</Button>
          <Button color="secondary" onClick={() => navigate("/")}>
            Cadastrar-se
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <Menu>
        <ListagemEndereco />
      </Menu>
      <section className="m-auto mt-12 flex w-1/2 flex-col justify-center rounded-md bg-white p-5 shadow">
        <div className="flex w-full items-center justify-between">
          <button onClick={() => navigate("/")} className="self-start">
            <FaAngleLeft className="icon h-10 w-10" />
          </button>

          <div id="icones-de-acao" className="flex justify-end gap-4">
            <div
              id="Editar"
              className="bg--brown-light hover:bg-brown-light-active flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
              onClick={() => setIsEditing(!isEditing)}
            >
              <FiEdit2 className="icon" />
            </div>
            <div
              id="deletar"
              className="bg-brown-light hover:bg-brown-light-active flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
              onClick={deletarDados}
            >
              <AiOutlineDelete className="icon" />
            </div>
          </div>
        </div>

        <h3 className="text-center font-bold">Minha Conta</h3>

        <form onSubmit={alterarDados} className="mt-5 ml-4">
          <div className={baseText}>
            Nome:
            {isEditing ? (
              <Input type="text" id="nome" name="nome" value={nome} onChange={setNome} />
            ) : (
              <span className="font-semibold">{nome}</span>
            )}
          </div>

          <div className={baseText}>
            Telefone:
            {isEditing ? (
              <PatternFormat
                format="(##) #####-####"
                mask="_"
                allowEmptyFormatting
                value={telefone}
                onValueChange={(values: NumberFormatValues) => setTelefone(values.value)}
                placeholder="(XX) 99999-9999"
                className="input !w-45"
                type="tel"
                id="telefone"
              />
            ) : (
              <>
                <PatternFormat
                  value={telefone}
                  displayType="text"
                  format="(##) #####-####"
                  className="font-semibold"
                />
              </>

            )}
          </div>

          <p className="mt-3 flex items-center justify-start gap-2 p-0 text-lg">
            Email:
            <span className="font-semibold">{email}</span>
          </p>

          {isEditing ? (
            <Button type="submit" className="mt-5">
              Salvar
            </Button>
          ) : null}
        </form>
        <hr className="my-4 text-gray-light border-2 rounded-xl" />

        <div className="text-right">
          <Button
            color="outlined"
            className="mt-3 w-55 p-2"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      </section>
    </>
  );
}
