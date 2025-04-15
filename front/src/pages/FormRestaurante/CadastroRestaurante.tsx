import Input from "../../components/Input";
import Button from "../../components/Button";
import { NumberFormatValues, PatternFormat } from "react-number-format";
import { FaAngleLeft } from "react-icons/fa6";
import { useCadastroRestaurante } from "./useCadastroRestaurante";
import ModalEmail from "../../components/ModalEmail";

export default function CadastroRestaurante() {
  const {
    formList,
		setFormList,
		styleInput,    
		etapa,
		setEtapa,
		validarEmail,
		navigate,
		setCepLimpo,
		mostrarModal,
		setMostrarModal,
		codigoEnviado,
		handleSubmit
  } = useCadastroRestaurante();

  
 
  return (
    <>
      {mostrarModal && (
        <ModalEmail
          codigoEnviado={codigoEnviado}
          isModalOpen={mostrarModal}
          setIsModalOpen={setMostrarModal}
          tipoEnvioCodigo={"email"}
          onSuccess={() => setEtapa("enderecoLoja")}
        />
      )}

      <div className="card mt-[5rem] m-auto max-w-130 rounded bg-white p-5 shadow">
        <form action=""  onSubmit={etapa === "dadosBancarioLoja" ? handleSubmit : undefined}>

          {etapa === "dadosLoja" && (
            <>
              <h1 className="font-bold text-center">Que bom te ver por aqui!</h1>
              <p className="mt-3 text-center">
                As informações abaixo serão usadas para iniciar o cadastro do seu
                restaurante
              </p>
              <div className="mt-6 space-y-4 text-left">
                <Input
                  id="nome"
                  name="nome"
                  textLabel="Infome o Razão Social:"
                  value={formList.nome}
                  onChange={(value) =>
                    setFormList({ ...formList, nome: value })
                  }
                  type="text"
                  required
                />

                <label htmlFor="telefone" className="font-medium">Insira seu telefone:</label>
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
                onClick={validarEmail}>
                Continuar
              </Button>
            </>
          )}

          {etapa === "enderecoLoja" && (
            <>
             <button
                onClick={() => setEtapa("dadosLoja")}
                className="mb-5 self-start"
              >
                <FaAngleLeft className="icon" />
              </button>
              <h1 className="font-bold text-center">Infomações da Loja</h1>
              <p className="my-4 text-center">Digite o CEP e complete as informações</p>

              <label htmlFor="cep" className="font-medium">CEP:</label>
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

              <div className="flex gap-4 mt-2">
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
              <div className="flex gap-4 mt-2">
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
                disabled={!formList.cep || !formList.endereco || !formList.estado || !formList.cidade || !formList.bairro}
                onClick={() => setEtapa("complementoLoja")}>
                Continuar
              </Button>

            </>
          )}



          {etapa === "complementoLoja" && (
            <>
              <button
                onClick={() => setEtapa("enderecoLoja")}
                className="mb-5 self-start"
              >
                <FaAngleLeft className="icon" />
              </button>

              <h1 className="font-bold text-center">Negócio e Responsável</h1>
              <h3 className="my-5 font-bold">
                Agora, nos fale mais sobre seu negócio
              </h3>

              <label htmlFor="cnpj" className="font-medium">Insira seu CNPJ:</label>
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

              <div id="compo-select">
                <label className="mb-1 block font-medium text-gray-700">
                  Especialidade
                </label>
                <select
                  className="mt-2 w-full rounded border p-2 input"
                  id="especialidade"
                  name="especialidade"
                  value={formList.especialidade}
                  onChange={(e) =>
                    setFormList({ ...formList, especialidade: e.target.value })
                  }
                >
                  <option value="">Selecione</option>
                  <option value="Brasileira">Brasileira</option>
                  <option value="Japonesa">Japonesa</option>
                  <option value="Italiana">Italiana</option>
                  <option value="Mexicana">Mexicana</option>
                  <option value="Outros">Outros</option>
                </select>
                <p className="mt-2">Esse item poderá ser alterado posteriormente</p>
              </div>

              <Button
                className="mt-6"
                type="button"
                disabled={!formList.cnpj || !formList.especialidade || !formList.descricao}
                onClick={() => setEtapa("dadosBancarioLoja")}>
                Continuar
              </Button>
            </>
          )}

          {etapa === "dadosBancarioLoja" && (
            <>
              <button
                onClick={() => setEtapa("complementoLoja")}
                className="mb-5 self-start"
              >
                <FaAngleLeft className="icon" />
              </button>

              <h1 className="my-5 font-bold text-center">
                Agora, nos informe seu dados bancários
              </h1>

              <Input
                textLabel="Banco:"
                className={`${styleInput}`}
                id="banco"
                name="banco"
                value={formList.banco}
                type="text"
                onChange={(value) =>
                  setFormList({ ...formList, banco: value })
                }
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

              <Button className="mt-3" type="submit" disabled={!formList.banco || !formList.cAgencia || !formList.cCorrente}>
                Finalizar
              </Button>
            </>
          )}

        </form>
      </div>
    </>
  );
}
