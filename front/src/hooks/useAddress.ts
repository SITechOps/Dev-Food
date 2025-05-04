import { useState, useEffect, useRef } from "react";
import { extractAddress } from "../utils/extractAddress";
import { reverseGeoCode } from "../utils/geolocation";
import { api } from "../connection/axios";
import { useAuth } from "../contexts/AuthContext";
import { IAddress } from "../interface/IAddress";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import { initMapScript } from "@/utils/initMapScript";
import { stringify } from "querystring";

export const useEndereco = () => {
  const { userData } = useAuth();
  const idUsuario = userData?.sub;
  const role = userData?.role;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchInput = useRef<HTMLInputElement | null>(null);
  const [address, setAddress] = useState<IAddress | null>(null);
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [tipo, setTipo] = useState("");
  const enderecoId = searchParams.get("id");

  const fecharModal = () => {
    navigate("/");
  };

  const fetchViaCep = async (cep: string) => {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    return response.json();
  };

  const onChangeAddress = async (
    autocomplete: google.maps.places.Autocomplete,
  ) => {
    const place = autocomplete.getPlace();
    const extracted = extractAddress(place);

    setAddress(extracted);
    if (searchInput.current) searchInput.current.value = extracted.plain();
    setNumero(extracted.numero || "");

    if (!extracted.bairro || !extracted.cidade || !extracted.estado) {
      if (extracted.cep) {
        const viaCepData = await fetchViaCep(extracted.cep);
        if (viaCepData) {
          setAddress((prev) => ({
            ...prev,
            bairro: extracted.bairro || viaCepData.bairro || prev?.bairro || "",
            cidade:
              extracted.cidade || viaCepData.localidade || prev?.cidade || "",
            estado: extracted.estado || viaCepData.uf || prev?.estado || "",
            pais: extracted.pais || prev?.pais || "Brasil",
            logradouro: prev?.logradouro || "",
            numero: prev?.numero || "",
            cep: prev?.cep || "",
            plain: prev?.plain || (() => ""),
          }));
        }
      }
    }
  };

  const initAutocomplete = useCallback(() => {
    if (typeof window !== "undefined" && searchInput.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        searchInput.current,
      );
      autocomplete.setFields(["address_component", "geometry"]);
      autocomplete.addListener("place_changed", () =>
        onChangeAddress(autocomplete),
      );
    }
  }, []);

  const findMyLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        const result = await reverseGeoCode(coords.latitude, coords.longitude);
        setAddress(result);
        if (searchInput.current) searchInput.current.value = result.plain();
        setNumero(result.numero || "");
      });
    }
  };

  const handleFavoritar = (tipoSelecionado: string) => setTipo(tipoSelecionado);

  const handleEditar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !numero)
      return alert("Por favor, preencha todos os campos do endereço.");
    if (!idUsuario) return alert("Erro ao obter ID do usuário.");

    const enderecoFinal = {
      id_usuario: idUsuario,
      attributes: {
        logradouro: address.logradouro,
        numero,
        complemento,
        bairro: address.bairro,
        cidade: address.cidade,
        estado: address.estado,
        pais: address.pais,
        tipo,
      },
    };

    // Obtenha o token do localStorage
    const token = localStorage.getItem("token");
    // Obtenha o ID do endereço a partir do id_usuario
    const enderecoId = async () => {
      try {
        const response = await api.get(`/user/${idUsuario}/enderecos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return stringify(response.data[0].numero);
      } catch (error) {
        console.error("Erro ao obter ID do endereço:", error);
        return null;
      }
    };
    // Obtenha o ID do endereço
    const endereco = await enderecoId();

    try {
      await api.put(`/endereco/${endereco}`, { data: enderecoFinal });
      alert("Endereço atualizado com sucesso!");
      setAddress(null);
      setNumero("");
      setComplemento("");
      setTipo("");
      if (searchInput.current) searchInput.current.value = "";
      navigate("/");
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      alert("Erro ao atualizar endereço. Tente novamente.");
    }
  };

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !numero)
      return alert("Por favor, preencha todos os campos do endereço.");
    if (!idUsuario) return alert("Erro ao obter ID do usuário.");

    const enderecoFinal = {
      id_usuario: idUsuario,
      attributes: {
        logradouro: address.logradouro,
        numero,
        complemento,
        bairro: address.bairro,
        cidade: address.cidade,
        estado: address.estado,
        pais: address.pais,
        tipo,
      },
    };

    try {
      console.log("Dados enviados:", enderecoFinal);
      await api.post("/endereco", { data: enderecoFinal });
      alert("Endereço cadastrado com sucesso!");
      setAddress(null);
      setNumero("");
      setComplemento("");
      setTipo("");
      if (searchInput.current) searchInput.current.value = "";
      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar endereço:", error);
      alert("Erro ao cadastrar endereço. Tente novamente.");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        await initMapScript();
        initAutocomplete();
      } catch (error) {
        console.error("Erro ao carregar o Google Maps", error);
      }
    };
    load();
  }, [initMapScript, initAutocomplete]);

  return {
    searchInput,
    address,
    numero,
    complemento,
    tipo,
    role,
    setNumero,
    setTipo,
    setComplemento,
    handleFavoritar,
    handleCadastrar,
    handleEditar,
    findMyLocation,
    fecharModal,
  };
};
