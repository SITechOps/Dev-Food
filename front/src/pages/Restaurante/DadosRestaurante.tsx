
import Input from "../../components/Input";
import { useState, useEffect } from "react";
import Button from "../../components/Button";
import axios from "axios";


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

  return (
    <div>
      <p className="mt-15">INFORMAÇÕES DA LOJA</p>
      <h1 className="mt-5">Onde fica sua loja?</h1>

      <div className="mt-8 max-w-md">
        <p className="mt-2">Digite o CEP e complete as informações</p>
        <label className="mt-2 block font-medium text-gray-700">CEP*</label>
        <Input
          className="border"
          id="cep"
          name="cep"
          placeholder="00000-000"
          value={cep}
          onChange={setCep}
          type="text"
        />
        <br />
        <div className="flex gap-4">
          <label className="mt-2 block font-medium text-gray-700">Estado</label>
          <Input
            className="border"
            id="estado"
            name="estado"
            value={estado}
            onChange={setEstado}
            type="text"
          />
          <label className="mt-2 block font-medium text-gray-700">Cidade</label>
          <Input
            className="border"
            id="cidade"
            name="cidade"
            value={cidade}
            onChange={setCidade}
            type="text"
          />
        </div>
        <label className="mt-2 block font-medium text-gray-700">Bairro</label>
        <Input
          className="border"
          id="bairro"
          name="bairro"
          placeholder="Exemplo:Centro"
          value={bairro}
          onChange={setBairro}
          type="text"
        />
        <label className="mt-2 block font-medium text-gray-700">Endereço</label>
        <Input
          className="border"
          id="endereço"
          name="endereço"
          placeholder="Exemplo:Avenida Brasil"
          value={endereço}
          onChange={setEndereço}
          type="text"
        />
        <br />
        <div className="flex gap-4">
          <label className="mt-2 block font-medium text-gray-700">Número</label>
          <Input
            className="border"
            id="numero"
            name="numero"
            value={numero}
            onChange={setNumero}
            type="number"
          />
          <label className="mt-2 block font-medium text-gray-700">
            Complemento
          </label>
          <Input
            className="border"
            id="complemento"
            name="complemento"
            value={complemento}
            onChange={setComplemento}
            type="text"
          />
        </div>
      </div>

      <div className="absolute top-0 right-0 max-w-md">
        <p>NEGÓCIO E RESPONSÁVEL</p>
        <h1 className="mt-5">Agora, nos fale mais sobre seu negócio</h1>

        <label className="mt-8 block font-medium text-gray-700">CNPJ</label>
        <Input
          className="border"
          id="cnpj"
          name="cnpj"
          placeholder="00.000.000/0000-00"
          value={cnpj}
          onChange={setCnpj}
        />
        <label className="mt-8 block font-medium text-gray-700">
          Especialidade
        </label>
        <select
          className="mt-2 w-full rounded border p-2"
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

        <p>Esse item poderá ser alterado posteriormente</p>
        <div className="mt-6 flex justify-center">
          <Button className="w-48">Finalizar</Button>
        </div>
      </div>
    </div>
  );
}
