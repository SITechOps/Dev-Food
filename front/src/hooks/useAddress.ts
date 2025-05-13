import { useState, useEffect, useRef, useCallback } from "react";
import { extractAddress } from "../utils/extractAddress";
import { reverseGeoCode } from "../utils/geolocation";
import { api } from "../connection/axios";
import { useAuth } from "../contexts/AuthContext";
import { IEndereco } from "../interface/IEndereco";
import { useNavigate } from "react-router-dom";
import { initMapScript } from "@/utils/initMapScript";
import { stringify } from "querystring";

export const useEndereco = () => {
  const { userData } = useAuth();
  const idUsuario = userData?.sub;
  const role = userData?.role;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchInput = useRef<HTMLInputElement | null>(null);
  const [address, setAddress] = useState<IEndereco | null>(null);
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [tipo, setTipo] = useState("");
  const enderecoId = searchParams.get("id");

  const fecharModal = () => navigate("/");

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

    if (searchInput.current && extracted.plain) {
      searchInput.current.value = extracted.plain();
    }
    setNumero(String(extracted.numero ?? ""));

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
        if (searchInput.current)
          searchInput.current.value = result.plain?.() ?? "";
        setNumero(String(result.numero ?? ""));
      });
    }
  };

  const handleFavoritar = (tipoSelecionado: string) => setTipo(tipoSelecionado);

  const buildEnderecoPayload = () => ({
    id_usuario: idUsuario,
    attributes: {
      logradouro: address?.logradouro ?? "",
      numero,
      complemento,
      bairro: address?.bairro ?? "",
      cidade: address?.cidade ?? "",
      estado: address?.estado ?? "",
      pais: address?.pais ?? "Brasil",
      tipo,
    },
  });

  const getEnderecoId = async (): Promise<string | null> => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/user/${idUsuario}/enderecos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data[0]?.id ?? null;
    } catch (error) {
      console.error("Erro ao obter ID do endereço:", error);
      return null;
    }
  };

  const limparCampos = () => {
    setAddress(null);
    setNumero("");
    setComplemento("");
    setTipo("");
    if (searchInput.current) searchInput.current.value = "";
  };

  const handleEditar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !numero)
      return alert("Por favor, preencha todos os campos do endereço.");
    if (!idUsuario) return alert("Erro ao obter ID do usuário.");

    const enderecoId = await getEnderecoId();
    if (!enderecoId) return alert("Endereço não encontrado para edição.");

    try {
      await api.put(`/endereco/${enderecoId}`, {
        data: buildEnderecoPayload(),
      });
      alert("Endereço atualizado com sucesso!");
      limparCampos();
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

    try {
      await api.post("/endereco", {
        data: buildEnderecoPayload(),
      });
      alert("Endereço cadastrado com sucesso!");
      limparCampos();
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
  }, [initAutocomplete]);

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
