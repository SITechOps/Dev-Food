import { FaAngleLeft } from "react-icons/fa6";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import Input from "./Input";
import Button from "./Button";
import { NumberFormatValues, PatternFormat } from "react-number-format";
import { useRestaurantAccountComponent } from "../hooks/useRestaurantAccount";

export default function RestaurantForm() {
  const {
    navigate,
    formList,
    setFormList,
    isEditing,
    setIsEditing,
    idRestaurante,
    handleLogout,
    deletarDados,
    alterarDados,
  } = useRestaurantAccountComponent();
  const baseText =
    "text-blue mt-3 flex items-center justify-start gap-2 p-0 text-lg";
  const iconStyle =
    "bg-brown-light hover:bg-brown-light-active flex h-10 w-10 cursor-pointer items-center justify-center rounded-full";

  if (!idRestaurante) {
    return (
      <section className="flex h-screen flex-col items-center justify-center">
        <h2 className="font-bold">Acesso negado</h2>
        <p className="mt-2">Faça login para acessar sua conta!</p>
        <Button onClick={() => navigate("/auth")} className="mt-5 w-100">
          Fazer Login
        </Button>
      </section>
    );
  }

  return (
    <>
      <section className="m-auto mt-10 flex w-1/2 flex-col justify-center rounded-md bg-white p-5 shadow">
        <div className="flex w-full items-center justify-between">
          <button onClick={() => navigate("/")} className="self-start">
            <FaAngleLeft className="icon h-10 w-10" />
          </button>

          <div id="icones-de-acao" className="flex justify-end gap-4">
            <div
              id="Editar"
              className={iconStyle}
              onClick={() => setIsEditing(!isEditing)}
            >
              <FiEdit2 className="icon" />
            </div>
            <div id="deletar" className={iconStyle} onClick={deletarDados}>
              <AiOutlineDelete className="icon" />
            </div>
          </div>
        </div>

        <h3 className="text-center font-bold">Minha Conta</h3>

        <form onSubmit={alterarDados} className="mt-5 ml-4">
          <div className={baseText}>
            Nome:
            {isEditing ? (
              <Input
                type="text"
                id="nome"
                name="nome"
                value={formList.nome}
                onChange={(value) => setFormList({ ...formList, nome: value })}
              />
            ) : (
              <span className="font-semibold">{formList.nome}</span>
            )}
          </div>

          <div className={baseText}>
            Telefone:
            {isEditing ? (
              <PatternFormat
                format="(##) #####-####"
                mask="_"
                allowEmptyFormatting
                value={formList.telefone}
                onValueChange={(values: NumberFormatValues) =>
                  setFormList((prev) => ({ ...prev, telefone: values.value }))
                }
                placeholder="(XX) 99999-9999"
                className="input !w-45"
                type="tel"
                id="telefone"
              />
            ) : (
              <PatternFormat
                value={formList.telefone}
                displayType="text"
                format="(##) #####-####"
                className="font-semibold"
              />
            )}
          </div>

          <div className={baseText}>
            Email:
            <span className="font-semibold">{formList.email}</span>
          </div>

          <div className={baseText}>
            Descrição:
            {isEditing ? (
              <Input
                type="text"
                id="descricao"
                name="descricao"
                value={formList.descricao}
                onChange={(value) =>
                  setFormList({ ...formList, descricao: value })
                }
              />
            ) : (
              <span className="font-semibold">{formList.descricao}</span>
            )}
          </div>

          <div className={baseText}>
            Especialidade:
            {isEditing ? (
              <Input
                type="text"
                id="especialidade"
                name="especialidade"
                value={formList.especialidade}
                onChange={(value) =>
                  setFormList({ ...formList, especialidade: value })
                }
              />
            ) : (
              <span className="font-semibold">{formList.especialidade}</span>
            )}
          </div>

          <div className={baseText}>
            Horário de funcionamento:
            {isEditing ? (
              <Input
                type="text"
                id="horario_funcionamento"
                name="horario_funcionamento"
                value={formList.horario_funcionamento}
                onChange={(value) =>
                  setFormList({ ...formList, horario_funcionamento: value })
                }
              />
            ) : (
              <span className="font-semibold">
                {formList.horario_funcionamento}
              </span>
            )}
          </div>

          <div className={baseText}>
            Razão Social:
            {isEditing ? (
              <Input
                type="text"
                id="razao_social"
                name="razao_social"
                value={formList.razao_social}
                onChange={(value) =>
                  setFormList({ ...formList, razao_social: value })
                }
              />
            ) : (
              <span className="font-semibold">{formList.razao_social}</span>
            )}
          </div>

          <div className={baseText}>
            CNPJ:
            {isEditing ? (
              <PatternFormat
                format="##.###.###/####-##"
                mask="_"
                value={formList.cnpj}
                onValueChange={(values: NumberFormatValues) =>
                  setFormList((prev) => ({ ...prev, cnpj: values.value }))
                }
                className="input !w-45"
                type="text"
                id="cnpj"
              />
            ) : (
              <PatternFormat
                value={formList.cnpj}
                displayType="text"
                format="##.###.###/####-##"
                className="font-semibold"
              />
            )}
          </div>

          <div className={baseText}>
            Banco:
            {isEditing ? (
              <Input
                type="text"
                id="banco"
                name="banco"
                value={formList.banco}
                onChange={(value) => setFormList({ ...formList, banco: value })}
              />
            ) : (
              <span className="font-semibold">{formList.banco}</span>
            )}
          </div>

          <div className={baseText}>
            Agência:
            {isEditing ? (
              <Input
                type="text"
                id="agencia"
                name="agencia"
                value={formList.agencia}
                onChange={(value) =>
                  setFormList({ ...formList, agencia: value })
                }
              />
            ) : (
              <span className="font-semibold">{formList.agencia}</span>
            )}
          </div>

          <div className={baseText}>
            Número da Conta:
            {isEditing ? (
              <Input
                type="text"
                id="nro_conta"
                name="nro_conta"
                value={formList.nro_conta}
                onChange={(value) =>
                  setFormList({ ...formList, nro_conta: value })
                }
              />
            ) : (
              <span className="font-semibold">{formList.nro_conta}</span>
            )}
          </div>

          <div className={baseText}>
            Tipo de Conta:
            {isEditing ? (
              <Input
                type="text"
                id="tipo_conta"
                name="tipo_conta"
                value={formList.tipo_conta}
                onChange={(value) =>
                  setFormList({ ...formList, tipo_conta: value })
                }
              />
            ) : (
              <span className="font-semibold">{formList.tipo_conta}</span>
            )}
          </div>

          {isEditing ? (
            <Button type="submit" className="mt-5">
              Salvar
            </Button>
          ) : null}
        </form>
        <hr className="text-gray-light my-4 rounded-xl border-2" />

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
