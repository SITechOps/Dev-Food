import Input from "../../components/ui/Input";
import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import axios from "axios";
import { api } from "../../connection/axios";

export default function DadosRestaurante() {
  const [formList, setFormList] = useState({
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    endereco: "",
    complemento: "",
    numero: "",
    cnpj: "",
    especialidade: "",
  });

  const styleInput = "border-2 border-gray-medium my-3";

  // Faz a busca no ViaCEP quando o CEP tiver 8 dígitos
  useEffect(() => {
    const cepLimpo = formList.cep.replace(/\D/g, "");

    if (cepLimpo.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then((res) => {
          if (!res.data.erro) {
            setFormList({
              ...formList,
              estado: res.data.uf,
              cidade: res.data.localidade,
              bairro: res.data.bairro,
              endereco: res.data.logradouro,
            });
          } else {
            console.warn("CEP não encontrado.");
          }
        })
        .catch((err) => {
          console.error("Erro ao buscar o CEP:", err);
        });
    }
  }, [formList.cep]);

  const handleSubmit = () => {
    const dados = {
      cnpj: formList.cnpj,
      especialidade: formList.especialidade,
      endereco: {
        logradouro: formList.endereco,
        bairro: formList.bairro,
        cidade: formList.cidade,
        estado: formList.estado,
        pais: "Brasil",
        numero: parseInt(formList.numero),
        complemento: formList.complemento,
      },
    };

    api
      .post("/restaurantes", {
        data: dados,
      })
      .then((response) => {
        console.log("Restaurante cadastrado com sucesso!", response.data);
        // você pode redirecionar, exibir alerta ou limpar os campos aqui
      })
      .catch((error) => {
        console.error("Erro ao cadastrar restaurante:", error);
      });
  };

  return (
    <div className="m-auto mt-[5rem] flex w-full flex-wrap items-start justify-center gap-30">
      <div className="">
        <h1 className="font-bold">Infomações da Loja</h1>
        <h3 className="mt-5 font-bold">Onde fica sua loja?</h3>
        <p className="my-4">Digite o CEP e complete as informações</p>
        <Input
          textLabel="CEP:"
          className={styleInput}
          id="cep"
          name="cep"
          placeholder="00000-000" // faltou formatar use o PatternFormat, NumberFormatValues
          value={formList.cep}
          onChange={(value) => setFormList({ ...formList, cep: value })}
          type="text"
        />
        <div className="flex gap-4">
          <Input
            textLabel="Estado:"
            className={styleInput}
            id="estado"
            name="estado"
            value={formList.estado}
            onChange={(value) => setFormList({ ...formList, estado: value })}
            type="text"
          />
          <Input
            textLabel="Cidade:"
            className={styleInput}
            id="cidade"
            name="cidade"
            value={formList.cidade}
            onChange={(value) => setFormList({ ...formList, cidade: value })}
            type="text"
          />
        </div>

        <Input
          textLabel="Bairro:"
          className={`${styleInput} mt-3`}
          id="bairro"
          name="bairro"
          placeholder="Exemplo:Centro"
          value={formList.bairro}
          onChange={(value) => setFormList({ ...formList, bairro: value })}
          type="text"
        />
        <Input
          textLabel="Endereço:"
          className={styleInput}
          id="endereço"
          name="endereço"
          placeholder="Exemplo:Avenida Brasil"
          value={formList.endereco}
          onChange={(value) => setFormList({ ...formList, endereco: value })}
          type="text"
        />
        <div className="flex gap-4">
          <Input
            textLabel="Número:"
            className={styleInput}
            id="numero"
            name="numero"
            value={formList.numero}
            onChange={(value) => setFormList({ ...formList, numero: value })}
            type="number"
          />
          <Input
            textLabel="Complemento:"
            className={styleInput}
            id="complemento"
            name="complemento"
            value={formList.complemento}
            onChange={(value) =>
              setFormList({ ...formList, complemento: value })
            }
            type="text"
          />
        </div>
      </div>

      <hr className="bg-gray-medium h-[38rem] w-px border-1" />

      <div className="">
        <h1 className="font-bold">Negócio e Responsável</h1>
        <h3 className="my-5 font-bold">
          Agora, nos fale mais sobre seu negócio
        </h3>

        <Input
          textLabel="CNPJ:"
          className={styleInput}
          id="cnpj"
          name="cnpj"
          placeholder="00.000.000/0000-00" // faltou formatar use o PatternFormat, NumberFormatValues
          value={formList.cnpj}
          onChange={(value) => setFormList({ ...formList, cnpj: value })}
        />
        <div id="compo-select">
          <label className="mt-4 mb-1 block font-medium text-gray-700">
            Especialidade
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
            <option value="Brasileira">Brasileira</option>
            <option value="Japonesa">Japonesa</option>
            <option value="Italiana">Italiana</option>
            <option value="Mexicana">Mexicana</option>
            <option value="Outros">Outros</option>
          </select>
          <p className="mt-2">Esse item poderá ser alterado posteriormente</p>
        </div>

        <h3 className="my-5 font-bold">
          Agora, nos informe seu dados bancários
        </h3>

        {/* incluir os inputs dos dados bancarios */}

        <div className="mt-[10rem]">
          <Button className="" onClick={handleSubmit}>
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  );
}
