import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import ImageUploadButton from "@/shared/components/ui/ImageUploadButton";
import { NumberFormatValues, PatternFormat } from "react-number-format";
import { useCadastroRestaurante } from "../hooks/useCadastroRestaurante";
import ModalCodigoVerificacao from "../../../shared/components/ModalCodigoVerificacao";
import IconAction from "@/shared/components/ui/IconAction";

export default function CadastroRestaurante() {
  const {
    formList,
    setFormList,
    styleInput,
    etapa,
    setEtapa,
    validarEmail,
    setCepLimpo,
    mostrarModal,
    setMostrarModal,
    codigoEnviado,
    handleSubmit,
    setImageFile,
  } = useCadastroRestaurante();

  return (
    <>
      {mostrarModal && (
        <ModalCodigoVerificacao
          qtd_digitos={6}
          codigoEnviado={codigoEnviado}
          isModalOpen={mostrarModal}
          setIsModalOpen={setMostrarModal}
          tipoEnvioCodigo={"email"}
          onSuccess={() => setEtapa("enderecoLoja")}
        />
      )}

      <div className="card m-auto mt-[5rem] max-w-130 rounded bg-white p-5 shadow">
        <form
          action=""
          onSubmit={etapa === "dadosBancarioLoja" ? handleSubmit : undefined}
        >
          {etapa === "dadosLoja" && (
            <>
              <h1 className="text-center font-bold">
                Que bom te ver por aqui!
              </h1>
              <p className="mt-3 text-center">
                As informações abaixo serão usadas para iniciar o cadastro do
                seu restaurante
              </p>
              <div className="mt-6 space-y-4 text-left">
                <Input
                  id="nome"
                  name="nome"
                  textLabel="Nome fantasia do restaurante:"
                  value={formList.nome}
                  onChange={(value) =>
                    setFormList({ ...formList, nome: value })
                  }
                  type="text"
                  required
                />

                <label htmlFor="telefone" className="font-medium">
                  Insira seu telefone:
                </label>
                <PatternFormat
                  format="(##) #####-####"
                  mask="_"
                  allowEmptyFormatting
                  value={formList.telefone}
                  onValueChange={(values: NumberFormatValues) =>
                    setFormList((prev) => ({ ...prev, telefone: values.value }))
                  }
                  className="input"
                  placeholder="(XX) 99999-9999"
                  type="tel"
                  id="telefone"
                  required
                />

                <Input
                  textLabel="Infome seu e-mail:"
                  id="email"
                  name="email"
                  placeholder="exemplo@gmail.com"
                  value={formList.email}
                  onChange={(value) =>
                    setFormList({ ...formList, email: value })
                  }
                  type="email"
                  required
                />
              </div>
              <Button
                className="mt-6"
                type="button"
                disabled={!formList.nome || !formList.email}
                onClick={validarEmail}
              >
                Continuar
              </Button>
            </>
          )}

          {etapa === "enderecoLoja" && (
            <>
              <IconAction
                className="mb-3"
                onClick={() => setEtapa("dadosLoja")}
              />

              <h1 className="text-center font-bold">Infomações da Loja</h1>
              <p className="my-4 text-center">
                Digite o CEP e complete as informações
              </p>

              <label htmlFor="cep" className="font-medium">
                CEP:
              </label>
              <PatternFormat
                format="#####-###"
                mask="_"
                allowEmptyFormatting
                value={formList.cep}
                onValueChange={(values: NumberFormatValues) => {
                  const rawCep = values.value;
                  setFormList((prev) => ({ ...prev, cep: rawCep }));
                  setCepLimpo(rawCep.replace(/\D/g, ""));
                }}
                className={`${styleInput} input`}
                id="cep"
                name="cep"
                placeholder="00000-000"
                required
              />

              <Input
                textLabel="Endereço:"
                className={styleInput}
                id="endereço"
                name="endereço"
                placeholder="Exemplo: Avenida Brasil"
                value={formList.endereco}
                onChange={(value) =>
                  setFormList({ ...formList, endereco: value })
                }
                type="text"
              />

              <Input
                textLabel="Bairro:"
                className={`${styleInput} mt-3`}
                id="bairro"
                name="bairro"
                placeholder="Exemplo: Centro"
                value={formList.bairro}
                onChange={(value) =>
                  setFormList({ ...formList, bairro: value })
                }
                type="text"
              />

              <div className="mt-2 flex gap-4">
                <Input
                  textLabel="Número:"
                  className={styleInput}
                  id="numero"
                  name="numero"
                  placeholder="Exemplo: 123"
                  value={formList.numero}
                  onChange={(value) =>
                    setFormList({ ...formList, numero: value })
                  }
                  type="number"
                />
                <Input
                  textLabel="Complemento:"
                  className={styleInput}
                  id="complemento"
                  name="complemento"
                  placeholder="Exemplo: Sala 1"
                  value={formList.complemento}
                  type="text"
                  onChange={(value) =>
                    setFormList({ ...formList, complemento: value })
                  }
                />
              </div>
              <div className="mt-2 flex gap-4">
                <Input
                  textLabel="Estado:"
                  className={styleInput}
                  id="estado"
                  name="estado"
                  value={formList.estado}
                  onChange={(value) =>
                    setFormList({ ...formList, estado: value })
                  }
                  type="text"
                />
                <Input
                  textLabel="Cidade:"
                  className={`${styleInput}`}
                  id="cidade"
                  name="cidade"
                  value={formList.cidade}
                  onChange={(value) =>
                    setFormList({ ...formList, cidade: value })
                  }
                  type="text"
                />
              </div>

              <Button
                className="mt-5"
                type="button"
                disabled={
                  !formList.cep ||
                  !formList.endereco ||
                  !formList.estado ||
                  !formList.cidade ||
                  !formList.bairro
                }
                onClick={() => setEtapa("complementoLoja")}
              >
                Continuar
              </Button>
            </>
          )}

          {etapa === "complementoLoja" && (
            <>
              <IconAction
                className="mb-3"
                onClick={() => setEtapa("enderecoLoja")}
              />

              <h1 className="text-center font-bold">Negócio e Responsável</h1>
              <h3 className="my-5 font-bold">
                Agora, nos fale mais sobre seu negócio
              </h3>

              <Input
                id="razaoSocial"
                name="razaoSocial"
                className={`${styleInput}`}
                textLabel="Infome a Razão Social:"
                value={formList.razaoSocial}
                onChange={(value) =>
                  setFormList({ ...formList, razaoSocial: value })
                }
                type="text"
                required
              />

              <label htmlFor="cnpj" className="font-medium">
                Insira seu CNPJ:
              </label>
              <PatternFormat
                format="##.###.###/####-##"
                mask="_"
                allowEmptyFormatting
                value={formList.cnpj}
                onValueChange={(values: NumberFormatValues) =>
                  setFormList((prev) => ({ ...prev, cnpj: values.value }))
                }
                className={`${styleInput} input`}
                id="cnpj"
                name="cnpj"
                required
              />
              <Input
                textLabel="Descrição do restaurante:"
                className={`${styleInput}`}
                id="descricao"
                name="descricao"
                value={formList.descricao}
                onChange={(value) =>
                  setFormList({ ...formList, descricao: value })
                }
                type="text"
              />
              <Input
                textLabel="Horário de funcionamento:"
                className={`${styleInput}`}
                id="horario_funcionamento"
                name="horario_funcionamento"
                placeholder="11:00 - 22:00"
                value={formList.horario_funcionamento}
                onChange={(value) =>
                  setFormList({ ...formList, horario_funcionamento: value })
                }
                type="text"
              />

              <div id="compo-select">
                <label className="mb-1 block font-medium text-gray-700">
                  Especialidade:
                </label>
                <select
                  className="input mt-2 w-full rounded border p-2"
                  id="especialidade"
                  name="especialidade"
                  value={formList.especialidade}
                  onChange={(e) =>
                    setFormList({ ...formList, especialidade: e.target.value })
                  }
                >
                  <option value="">Selecione</option>
                  <option value="Lanches">Lanches</option>
                  <option value="Saudáveis">Saudáveis</option>
                  <option value="Brasileira">Brasileira</option>
                  <option value="Japonesa">Japonesa</option>
                  <option value="Italiana">Italiana</option>
                  <option value="Mexicana">Mexicana</option>
                  <option value="Árabe">Árabe</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div className="mt-2">
                <label className="mb-1 block font-medium text-gray-700">
                  Logo do Restaurante:
                </label>
                <ImageUploadButton
                  onFileSelect={(file) => setImageFile(file)}
                />
              </div>

              <Button
                className="mt-6"
                type="button"
                disabled={
                  !formList.cnpj ||
                  !formList.especialidade ||
                  !formList.descricao
                }
                onClick={() => setEtapa("dadosBancarioLoja")}
              >
                Continuar
              </Button>
            </>
          )}

          {etapa === "dadosBancarioLoja" && (
            <>
              <IconAction
                className="mb-3"
                onClick={() => setEtapa("complementoLoja")}
              />

              <h1 className="my-5 text-center font-bold">
                Agora, nos informe seu dados bancários
              </h1>

              <Input
                textLabel="Banco:"
                className={`${styleInput}`}
                id="banco"
                name="banco"
                value={formList.banco}
                type="text"
                onChange={(value) => setFormList({ ...formList, banco: value })}
              />

              <div className="flex gap-6">
                <Input
                  textLabel="Código da agência:"
                  className={`${styleInput}`}
                  id="cAgencia"
                  name="cAgencia"
                  value={formList.cAgencia}
                  type="text"
                  onChange={(value) =>
                    setFormList({ ...formList, cAgencia: value })
                  }
                />
                <Input
                  textLabel="Conta corrente:"
                  className={`${styleInput}`}
                  id="cCorrente"
                  name="cCorrente"
                  value={formList.cCorrente}
                  type="text"
                  onChange={(value) =>
                    setFormList({ ...formList, cCorrente: value })
                  }
                />
              </div>

              <Button
                className="mt-3"
                type="submit"
                disabled={
                  !formList.banco || !formList.cAgencia || !formList.cCorrente
                }
              >
                Finalizar
              </Button>
            </>
          )}
        </form>
      </div>
    </>
  );
}
