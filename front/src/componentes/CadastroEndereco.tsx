import { useState, useEffect, useRef } from "react";

import { PiGpsFixDuotone } from "react-icons/pi";
import { TbHomeFilled } from "react-icons/tb";
import { IoBusiness } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";

import { extractAddress } from "../utils/extractAddress";
import { loadAsyncScript } from "../utils/loadAsyncScript";
import { reverseGeoCode } from "../utils/geolocation";
import { IAddress } from "../interface/IAddress";

import Input from "../componentes/Input";

import { api } from "../connection/axios";
import Button from "../componentes/Button";
import { decodeToken } from "../utils/decodeToken";
const userData = decodeToken(localStorage.getItem("token") || "");
const idUsuario = userData?.sub
const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const mapApiJs = "https://maps.googleapis.com/maps/api/js";

const CadastroEndereco = () => {
  const searchInput = useRef<HTMLInputElement | null>(null);
  const [address, setAddress] = useState<IAddress | null>(null);
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
    <section className="fixed inset-0 flex h-screen items-center justify-center bg-black/50">
      <div className="mt-5 w-[23rem]">
        <form className="bg-white rounded-md p-6 mt-5" onSubmit={handleCadastrar}>
          <legend className="text-center font-bold mx-2">Informe seu endereço</legend>
          <div className="my-2 relative w-full">
            <Input ref={searchInput} type="text" placeholder="Digite o endereço..." className="w-full" />
            <button
              type="button"
              onClick={findMyLocation}
              className="icon absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-claro pl-2"
            >
              <PiGpsFixDuotone />
            </button>
          </div>

          {address && (
            <>
              <hr className="my-5 text-gray-medio rounded-lg" />
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-3 mb-2 w-full">
                <FaMapMarkerAlt className="!text-brown-dark icon" />
                <p>
                  <span className="font-semibold">
                  {address.logradouro || address.pais}
                  </span>
                  {address.logradouro || address.pais
                    ? `, ${address.cidade || address.bairro} - ${address.estado}`
                    : address.logradouro || address.pais
                    ? `, ${address.cidade || address.bairro}`
                    : ""}
                </p>
              </div>

              {/* Campos complementares */}
              <div id="dados-complementares">
                <div className="flex gap-4 mb-3">
                  <Input
                    type="text"
                    value={numero}
                    placeholder="Número"
                    onChange={(value: string) => setNumero(value)}
                    className="w-[6rem]"
                  />

                  <Input
                    type="text"
                    value={complemento}
                    placeholder="Complemento"
                    onChange={(value: string) => setComplemento(value)}
                    className="w-[13rem]"
                  />
                </div>

                <div className="mt-5">
                  <label>Favoritar como:</label>
                  <div className="flex space-x-4 my-5">
                    <button
                      type="button"
                      onClick={() => handleFavoritar("Casa")}
                      className={`px-2 py-1 rounded flex items-center space-x-2 bg-gray-claro text-gray-medio transition-all duration-300 ease-in-out ${tipo === "Casa"
                        ? "border-2 border-brown-normal"
                        : "border-2 border-transparent hover:border-gray-medio"
                        }`}
                    >
                      <TbHomeFilled
                        className={`transition-colors duration-300 ${tipo === "Casa" ? "text-brown-normal" : "text-gray-medio hover:text-gray-medio"
                          }`}
                      />
                      <span>Casa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFavoritar("Trabalho")}
                      className={`px-2 py-1 rounded flex items-center space-x-2 bg-gray-claro text-gray-medio transition-all duration-300 ease-in-out ${tipo === "Trabalho"
                        ? "border-2 border-brown-normal"
                        : "border-2 border-transparent hover:border-gray-medio"
                        }`}
                    >
                      <IoBusiness
                        className={`transition-colors duration-300 ${tipo === "Trabalho" ? "text-brown-normal" : "text-gray-medio hover:text-gray-medio"
                          }`}
                      />
                      <span>Trabalho</span>
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={!address || !numero} className="mt-4">
                  Salvar endereço
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default CadastroEndereco;
