import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import ImageUploadButton from "@/shared/components/ui/ImageUploadButton";
import { PatternFormat } from "react-number-format";
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
    isLoadingCep,
    cepError,
    mostrarModal,
    setMostrarModal,
    codigoEnviado,
    handleSubmit,
    setImageFile,
    fetchnomeFantasiaPorCNPJ,
    isLoadingNomeFantasia,
    nomeFantasiaError,
    isNomeRestauranteLocked, // !!! IMPORTANTE: Adicione este estado ao seu hook useCadastroRestaurante
  } = useCadastroRestaurante();

  const handleCnpjValueChange = (cnpjLimpo: string) => {
    // A lógica de verificar o tamanho e chamar a API
    // já está dentro de fetchnomeFantasiaPorCNPJ no hook.
    fetchnomeFantasiaPorCNPJ(cnpjLimpo);
  };

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
                {/* CNPJ na primeira etapa usando PatternFormat para consistência */}
                <label htmlFor="cnpjDadosLoja" className="font-medium">
                  CNPJ do restaurante:
                </label>
                <PatternFormat
                  id="cnpjDadosLoja"
                  name="cnpj"
                  format="##.###.###/####-##"
                  mask="_"
                  allowEmptyFormatting
                  value={formList.cnpj} // Assumindo que formList.cnpj no hook armazena o valor limpo
                  onValueChange={(values) => {
                    // values.value é o valor limpo (só números)
                    setFormList(prev => ({ ...prev, cnpj: values.value }));
                    handleCnpjValueChange(values.value);
                  }}
                  className="input" // Garanta que a classe 'input' está definida e estilizada
                  placeholder="00.000.000/0000-00"
                  required
                  type="tel" // Para melhor UX em mobile
                />
                {/* Feedback para consulta de CNPJ */}
                {isLoadingNomeFantasia && (
                  <p className="mt-1 text-sm text-blue-600">Consultando dados do CNPJ...</p>
                )}
                {nomeFantasiaError && (
                  <p className="mt-1 text-sm text-red-600">{nomeFantasiaError}</p>
                )}

                <Input
                  id="nome"
                  name="nome"
                  textLabel="Nome fantasia do restaurante:"
                  value={formList.nome}
                  onChange={(value) => {
                    // Permite edição manual apenas se não estiver bloqueado pela API
                    if (!isNomeRestauranteLocked) {
                      setFormList({ ...formList, nome: value });
                    }
                  }}
                  type="text"
                  required
                  disabled={isNomeRestauranteLocked} // Desabilita se preenchido pela API
                />
                <label htmlFor="telefone" className="font-medium">
                  Insira seu telefone:
                </label>
                <PatternFormat
                  format="(##) #####-####"
                  mask="_"
                  allowEmptyFormatting
                  value={formList.telefone}
                  onValueChange={(values) =>
                    setFormList((prev) => ({ ...prev, telefone: values.value })) // values.value é o valor limpo
                  }
                  className="input"
                  placeholder="(XX) XXXXX-XXXX"
                  type="tel"
                  id="telefone"
                  required
                />

                <Input
                  textLabel="Informe seu e-mail:"
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
                disabled={
                  !formList.cnpj ||
                  formList.cnpj.length !== 14 || // Verifica se o CNPJ limpo tem 14 dígitos
                  !formList.nome ||
                  !formList.email ||
                  isLoadingNomeFantasia // Desabilita enquanto o CNPJ está sendo consultado
                }
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
              <h1 className="text-center font-bold">Informações da Loja</h1>
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
                value={formList.cep} // Assumindo que formList.cep no hook é o valor limpo
                onValueChange={(values) => {
                  // setFormList((prev) => ({ ...prev, cep: values.value })); // values.value é o limpo
                  // setCepLimpo já deve atualizar formList.cep no hook se necessário,
                  // ou o componente pode atualizar o formList.cep formatado/limpo aqui.
                  // A chamada setCepLimpo(values.value) deve ser suficiente se o hook gerencia formList.cep.
                  // Para manter o input exibindo o valor formatado enquanto digita,
                  // e o formList.cep sendo o valor limpo:
                  setFormList((prev) => ({ ...prev, cep: values.formattedValue })); // Mostra formatado
                  setCepLimpo(values.value); // Envia limpo para o hook
                }}
                className={`${styleInput} input`}
                id="cep"
                name="cep"
                placeholder="00000-000"
                type="tel"
                required
              />
              {isLoadingCep && <p className="mt-1 text-sm text-blue-600">Consultando CEP...</p>}
              {cepError && <p className="mt-1 text-sm text-red-600">{cepError}</p>}

              <Input
                textLabel="Endereço:"
                className={styleInput} // Removido `mt-3` daqui pois PatternFormat de CEP não tem margin bottom por padrão
                id="endereço"
                name="endereço"
                placeholder="Exemplo: Avenida Brasil"
                value={formList.endereco}
                onChange={(value) =>
                  setFormList({ ...formList, endereco: value })
                }
                type="text"
                readOnly={isLoadingCep || !!formList.endereco} // Mais específico: desabilitar se API preencheu
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
                readOnly={isLoadingCep || !!formList.bairro}
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
                  type="number" // Idealmente type="text" pattern="\d*" para evitar problemas com formatação/locale de número
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
                  readOnly={isLoadingCep || !!formList.estado}
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
                  readOnly={isLoadingCep || !!formList.cidade}
                />
              </div>

              <Button
                className="mt-5"
                type="button"
                disabled={
                  !formList.cep || // Idealmente verificar formList.cep.length === 8 (limpo)
                  !formList.endereco ||
                  !formList.numero ||
                  !formList.bairro ||
                  isLoadingCep
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
                id="apiNomeFantasia"
                name="apiNomeFantasia"
                className={`${styleInput}`}
                textLabel="Nome Fantasia (Consultado):"
                value={formList.nomeFantasia}
                onChange={(value) => {
                  // Permitir edição se não estiver bloqueado ou se for um campo diferente do `formList.nome` original
                  // Se este campo puder ser editado independentemente do `formList.nome` da primeira etapa:
                  setFormList({ ...formList, nomeFantasia: value });
                }}
                type="text"
                // Se este campo também deve ser bloqueado quando o CNPJ é consultado, adicione:
                // disabled={isNomeRestauranteLocked}
                // readOnly={isNomeRestauranteLocked} // Ou readOnly se preferir
                required
              />
              {/* Mensagem de erro e loading para o Nome Fantasia (vindo da consulta CNPJ) */}
              {/* Estas mensagens são as mesmas da primeira etapa, talvez precise diferenciá-las ou mostrá-las apenas uma vez */}
              {isLoadingNomeFantasia && <p className="mt-1 text-sm text-blue-600">Consultando dados do CNPJ...</p>}
              {nomeFantasiaError && <p className="mt-1 text-sm text-red-600">{nomeFantasiaError}</p>}

              <label htmlFor="cnpjComplemento" className="font-medium mt-3 block">
                CNPJ:
              </label>
              <PatternFormat
                format="##.###.###/####-##"
                mask="_"
                allowEmptyFormatting
                value={formList.cnpj} // CNPJ limpo vindo do formList
                onValueChange={(values) => {
                  const cnpjApenasNumeros = values.value;
                  setFormList((prev) => ({ ...prev, cnpj: cnpjApenasNumeros }));
                  handleCnpjValueChange(cnpjApenasNumeros); // Dispara a consulta se o CNPJ mudar aqui também
                }}
                className={`${styleInput} input`}
                id="cnpjComplemento"
                name="cnpj"
                placeholder="00.000.000/0000-00"
                type="tel"
                required
              />
              
              <Input
                textLabel="Descrição do restaurante:"
                className={`${styleInput} mt-3`}
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
                className={`${styleInput}`} // Removido mt-3
                id="horario_funcionamento"
                name="horario_funcionamento"
                placeholder="Ex: 08:00 - 18:00 / Seg-Sex, 09:00 - 13:00 / Sab"
                value={formList.horario_funcionamento}
                onChange={(value) =>
                  setFormList({ ...formList, horario_funcionamento: value })
                }
                type="text"
              />

              <div id="compo-select" className="mt-3"> {/* Adicionado mt-3 para espaçamento */}
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
                  !formList.cnpj || formList.cnpj.length !== 14 ||
                  !formList.nomeFantasia ||
                  !formList.especialidade ||
                  !formList.descricao ||
                  isLoadingNomeFantasia
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
                Agora, nos informe seus dados bancários
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
                  type="text" // Poderia ser "number" mas "text" com pattern é mais flexível
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
                  type="text" // Poderia ser "number"
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