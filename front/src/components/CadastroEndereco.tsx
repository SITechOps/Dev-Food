import { useState, useEffect, useRef } from "react";

import { PiGpsFixDuotone } from "react-icons/pi";
import { TbHomeFilled } from "react-icons/tb";
import { IoBusiness } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";

import { extractAddress } from "../utils/extractAddress";
import { loadAsyncScript } from "../utils/loadAsyncScript";
import { reverseGeoCode } from "../utils/geolocation";
import { IAddress } from "../interface/IAddress";

import Input from "./Input";

import { api } from "../connection/axios";
import Button from "./Button";
import { decodeToken } from "../utils/decodeToken";
const userData = decodeToken(localStorage.getItem("token") || "");
const idUsuario = userData?.sub;
const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const mapApiJs = "https://maps.googleapis.com/maps/api/js";

const CadastroEndereco = () => {
  const searchInput = useRef<HTMLInputElement | null>(null);
  const [address, setAddress] = useState<IAddress | null>(null);
  const [numero, setNumero] = useState<string>("");
  const [complemento, setComplemento] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");

  const initMapScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") return;

      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const scriptExists = document.querySelector(
        `script[src^="${mapApiJs}?key=${googleApiKey}"]`,
      );

      if (!scriptExists) {
        const script = document.createElement("script");
        script.src = `${mapApiJs}?key=${googleApiKey}&libraries=places&v=weekly`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          resolve();
        };

        script.onerror = (err) => {
          reject(err);
        };

        document.body.appendChild(script);
      } else {
        // se já existe o script, espera carregar
        scriptExists.addEventListener("load", () => resolve());
      }
    });
  };

  const fetchViaCep = async (cep: string) => {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    return data;
  };

  const onChangeAddress = async (
    autocomplete: google.maps.places.Autocomplete,
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
    if (typeof window !== "undefined" && !searchInput.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      searchInput.current!,
    );
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.addListener("place_changed", () =>
      onChangeAddress(autocomplete),
    );
  };

  const findMyLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        const _address = await reverseGeoCode(
          coords.latitude,
          coords.longitude,
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

    if (!address || !numero) {
      alert("Por favor, preencha todos os campos do endereço.");
      return;
    }

    if (!idUsuario) {
      alert("Erro ao obter ID do usuário.");
      return;
    }

    const enderecoFinal = {
      id_usuario: idUsuario,
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
      console.log("Dados enviados:", enderecoFinal); // Adicione este log para depuração
      await api.post("/endereco", { data: enderecoFinal });
      alert("Endereço cadastrado com sucesso!");

      // Limpar os campos após o cadastro
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
    const load = async () => {
      try {
        await initMapScript();
        initAutocomplete(); // só chama aqui depois de garantir que está pronto
      } catch (error) {
        console.error("Erro ao carregar o Google Maps", error);
      }
    };

    load();
  }, []);

  return (
    <section className="fixed inset-0 flex h-screen items-center justify-center bg-black/50">
      <div className="mt-5 w-96">
        <form
          className="mt-5 rounded-md bg-white p-6"
          onSubmit={handleCadastrar}
        >
          <legend className="mx-2 text-center font-bold">
            Informe seu endereço
          </legend>
          <div className="relative my-2 w-full">
            <Input
              ref={searchInput}
              type="text"
              placeholder="Digite o endereço..."
              className="w-full"
            />
            <button
              type="button"
              onClick={findMyLocation}
              className="icon bg-gray-light absolute top-1/2 right-3 -translate-y-1/2 transform pl-2"
            >
              <PiGpsFixDuotone />
            </button>
          </div>

          {address && (
            <>
              <hr className="text-gray-medium my-5 rounded-lg" />
              <div className="mb-2 flex w-full items-center space-x-2 rounded-lg bg-gray-100 p-3">
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

              <div id="dados-complementares">
                <div className="mb-3 flex gap-4">
                  <Input
                    type="text"
                    value={numero}
                    placeholder="Número"
                    onChange={setNumero}
                    className="w-24"
                  />

                  <Input
                    type="text"
                    value={complemento}
                    placeholder="Complemento"
                    onChange={setComplemento}
                    className="w-52"
                  />
                </div>

                <div className="mt-5">
                  <label>Favoritar como:</label>
                  <div className="my-5 flex space-x-4">
                    <button
                      type="button"
                      onClick={() => handleFavoritar("Casa")}
                      className={`bg-gray-light text-gray-medium flex items-center space-x-2 rounded px-2 py-1 transition-all duration-300 ease-in-out ${
                        tipo === "Casa"
                          ? "border-brown-normal border-2"
                          : "hover:border-gray-medium border-2 border-transparent"
                      }`}
                    >
                      <TbHomeFilled
                        className={`transition-colors duration-300 ${
                          tipo === "Casa"
                            ? "text-brown-normal"
                            : "text-gray-medium hover:text-gray-medium"
                        }`}
                      />
                      <span>Casa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFavoritar("Trabalho")}
                      className={`bg-gray-light text-gray-medium flex items-center space-x-2 rounded px-2 py-1 transition-all duration-300 ease-in-out ${
                        tipo === "Trabalho"
                          ? "border-brown-normal border-2"
                          : "hover:border-gray-medium border-2 border-transparent"
                      }`}
                    >
                      <IoBusiness
                        className={`transition-colors duration-300 ${
                          tipo === "Trabalho"
                            ? "text-brown-normal"
                            : "text-gray-medium hover:text-gray-medium"
                        }`}
                      />
                      <span>Trabalho</span>
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!address || !numero}
                  className="mt-4"
                >
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
