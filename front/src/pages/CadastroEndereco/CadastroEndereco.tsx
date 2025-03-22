import { useState, useEffect, useRef } from "react";

import { MdGpsFixed } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHome, FaCoffee } from "react-icons/fa";

import { extractAddress } from "../../utils/extractAddress";
import { loadAsyncScript } from "../../utils/loadAsyncScript";
import { reverseGeoCode } from "../../utils/geolocation";
import { Address } from "../../interface/IAddress";

import Input from "../../componentes/Input";

import { api } from "../../connection/axios";
import Button from "../../componentes/Button";
import { decodeToken } from "../../utils/decodeToken";
const userData = decodeToken(localStorage.getItem("token") || "");
const idUsuario = userData?.sub
console.log(idUsuario);

const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const mapApiJs = "https://maps.googleapis.com/maps/api/js";

const CadastroEndereco = () => {
  const searchInput = useRef<HTMLInputElement | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [numero, setNumero] = useState<string>("");
  const [complemento, setComplemento] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");

  const initMapScript = async () => {
    if (!window.google) {
      await loadAsyncScript(
        `${mapApiJs}?key=${googleApiKey}&libraries=places&v=weekly`
      );
    }
  };

  const fetchViaCep = async (cep: string) => {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    return data;
  };

  const onChangeAddress = async (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    const place = autocomplete.getPlace();
    const extractedAddress = extractAddress(place);

    setAddress(extractedAddress);
    if (searchInput.current) {
      searchInput.current.value = extractedAddress.plain();
    }
    setNumero(extractedAddress.numero || "");

    if (
      !extractedAddress.bairro ||
      !extractedAddress.cidade ||
      !extractedAddress.estado
    ) {
      if (extractedAddress.cep) {
        const cepData = await fetchViaCep(extractedAddress.cep);

        if (cepData) {
          setAddress((prev) => ({
            ...prev,
            bairro:
              extractedAddress.bairro || cepData.bairro || prev?.bairro || "",
            cidade:
              extractedAddress.cidade ||
              cepData.localidade ||
              prev?.cidade ||
              "",
            estado: extractedAddress.estado || cepData.uf || prev?.estado || "",
            pais: extractedAddress.pais || prev?.pais || "Brasil",
            logradouro: prev?.logradouro || "",
            numero: prev?.numero || "",
            cep: prev?.cep || "",
            plain: prev?.plain || (() => ""),
          }));
        }
      }
    }
  };

  const initAutocomplete = () => {
    if (!searchInput.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      searchInput.current
    );
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.addListener("place_changed", () =>
      onChangeAddress(autocomplete)
    );
  };

  const findMyLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        const _address = await reverseGeoCode(
          coords.latitude,
          coords.longitude
        );
        setAddress(_address);
        if (searchInput.current) searchInput.current.value = _address.plain();
        setNumero(_address.numero || "");
      });
    }
  };

  const handleFavoritar = (tipoSelecionado: string) => {
    setTipo(tipoSelecionado);
  };

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !numero || !complemento) {
      alert("Por favor, preencha todos os campos do endereço.");
      return;
    }

    const idUsuarioNumber = Number(idUsuario);
    if (!idUsuarioNumber) {
      alert("Erro ao obter ID do usuário.");
      return;
    }

    const enderecoFinal = {
      id_usuario: idUsuarioNumber,
      attributes: {
        logradouro: address.logradouro,
        numero: numero,
        complemento: complemento,
        bairro: address.bairro,
        cidade: address.cidade,
        estado: address.estado,
        pais: address.pais,
        tipo,
      },
    };

    try {
      const response = await api.post("/endereco", { data: enderecoFinal });
      console.log("Endereço cadastrado com sucesso:", response.data);

      setAddress(null);
      setNumero("");
      setComplemento("");
      setTipo("");

      if (searchInput.current) {
        searchInput.current.value = "";
      }
    } catch (error) {
      console.error("Erro ao cadastrar endereço:", error);
      alert("Erro ao cadastrar endereço. Tente novamente.");
    }
  };

  useEffect(() => {
    initMapScript().then(() => {
      if (searchInput.current) {
        initAutocomplete();
      }
    });
  }, []);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen w-full m-auto">
      <h1 className="text-3xl font-bold text-center mb-[3rem]">
        Faça compras no iFood
      </h1>
      <form
        className="bg-white rounded-md shadow w-[30] p-6"
        onSubmit={handleCadastrar}
      >
        <legend className="text-center !mb-[2rem]">
          Entregamos tudo o que precisa na porta da sua casa, informe seu
          endereço
        </legend>

        <div className="mb-6 relative w-full">
          <Input
            ref={searchInput}
            type="text"
            placeholder="Digite o endereço..."
            className="p-4 bg-black w-full pr-12"
          />
          <button
            type="button"
            onClick={findMyLocation}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-800 text-2xl"
          >
            <MdGpsFixed />
          </button>
        </div>

        {address && (
          <div className="bg-gray-100 rounded-lg p-4 mb-4 shadow-md w-full">
            <div className="flex items-center space-x-2 mb-2">
              <FaMapMarkerAlt className="text-red-500 text-xl" />
              <span className="text-sm font-semibold text-neutral-800">
                {address.logradouro}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                {address.bairro}, {address.cidade}, {address.estado},{" "}
                {address.pais}
              </p>
            </div>
          </div>
        )}

        <Input
          type="text"
          value={numero}
          placeholder="Número"
          onChange={(value: string) => setNumero(value)}
          className="p-4 mb-3"
        />

        <Input
          type="text"
          value={complemento}
          placeholder="Complemento..."
          onChange={(value: string) => setComplemento(value)}
          className="p-4 mb-3"
        />
        <label className="block text-gray-700 mb-2">Favoritar como:</label>
        <div className="flex space-x-4 mb-6">
          <button
            type="button"
            onClick={() => handleFavoritar("Casa")}
            className={`px-4 py-2 rounded flex items-center space-x-2 bg-gray-200 text-neutral-600 transition-all duration-300 ease-in-out ${
              tipo === "Casa"
                ? "border-2 border-red-500"
                : "border-2 border-transparent hover:border-gray-400"
            }`}
          >
            <FaHome
              className={`transition-colors duration-300 ${
                tipo === "Casa"
                  ? "text-red-500"
                  : "text-neutral-600 hover:text-gray-800"
              }`}
            />
            <span>Casa</span>
          </button>
          <button
            type="button"
            onClick={() => handleFavoritar("Trabalho")}
            className={`px-4 py-2 rounded flex items-center space-x-2 bg-gray-200 text-neutral-600 transition-all duration-300 ease-in-out ${
              tipo === "Trabalho"
                ? "border-2 border-red-500"
                : "border-2 border-transparent hover:border-gray-400"
            }`}
          >
            <FaCoffee
              className={`transition-colors duration-300 ${
                tipo === "Trabalho"
                  ? "text-red-500"
                  : "text-neutral-600 hover:text-gray-800"
              }`}
            />
            <span>Trabalho</span>
          </button>
        </div>
        <Button type="submit">Salvar endereço</Button>
      </form>
    </section>
  );
};

export default CadastroEndereco;
