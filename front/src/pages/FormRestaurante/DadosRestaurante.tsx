import Input from "../../components/Input";
import { useState, useEffect } from "react";
import Button from "../../components/Button";
import axios from "axios";
import { api } from "../../connection/axios";

export default function DadosRestaurante() {
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereço, setEndereço] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const styleInput = "border-2 border-gray-medium my-3";

  // Faz a busca no ViaCEP quando o CEP tiver 8 dígitos
  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then((res) => {
          if (!res.data.erro) {
            setEstado(res.data.uf);
            setCidade(res.data.localidade);
            setBairro(res.data.bairro);
            setEndereço(res.data.logradouro);
          } else {
            console.warn("CEP não encontrado.");
          }
        })
        .catch((err) => {
          console.error("Erro ao buscar o CEP:", err);
        });
    }
  }, [cep]);

  const handleSubmit = () => {
    const dados = {
      cnpj: cnpj,
      especialidade: especialidade,
      endereco: {
        logradouro: endereço,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        pais: "Brasil",
        numero: parseInt(numero),
        complemento: complemento,
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
    <div className="mt-[5rem] m-auto flex flex-wrap justify-center gap-30 w-full items-start">
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
          value={cep}
          onChange={setCep}
          type="text"
        />
        <div className="flex gap-4">
          <Input
            textLabel="Estado:"
            className={styleInput}
            id="estado"
            name="estado"
            value={estado}
            onChange={setEstado}
            type="text"
          />
          <Input
            textLabel="Cidade:"
            className={styleInput}
            id="cidade"
            name="cidade"
            value={cidade}
            onChange={setCidade}
            type="text"
          />
        </div>

        <Input
          textLabel="Bairro:"
          className={`${styleInput} mt-3`}
          id="bairro"
          name="bairro"
          placeholder="Exemplo:Centro"
          value={bairro}
          onChange={setBairro}
          type="text"
        />
        <Input
          textLabel="Endereço:"
          className={styleInput}
          id="endereço"
          name="endereço"
          placeholder="Exemplo:Avenida Brasil"
          value={endereço}
          onChange={setEndereço}
          type="text"
        />
        <div className="flex gap-4">
          <Input
            textLabel="Número:"
            className={styleInput}
            id="numero"
            name="numero"
            value={numero}
            onChange={setNumero}
            type="number"
          />
          <Input
            textLabel="Complemento:"
            className={styleInput}
            id="complemento"
            name="complemento"
            value={complemento}
            onChange={setComplemento}
            type="text"
          />
        </div>
      </div>

      <hr className="w-px h-[38rem] bg-gray-medium border-1" />


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
          placeholder="00.000.000/0000-00"  // faltou formatar use o PatternFormat, NumberFormatValues
          value={cnpj}
          onChange={setCnpj}
        />
        <div id="compo-select">
          <label className="mt-4 mb-1 block font-medium text-gray-700">
            Especialidade
          </label>
          <select
            className="mt-2 w-full rounded border p-2 input"
            id="especialidade"
            name="especialidade"
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
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
