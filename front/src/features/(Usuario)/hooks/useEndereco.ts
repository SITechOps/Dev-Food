import { useState, useEffect, useRef, useCallback } from "react";
import { extractAddress } from "@/shared/utils/extractAddress";
import { reverseGeoCode } from "@/shared/utils/geolocation";
import { api } from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { IEndereco } from "@/shared/interfaces/IEndereco";
import { useNavigate } from "react-router-dom";
import { initMapScript } from "@/shared/utils/initMapScript";
import {
  showError,
  showSuccess,
  showWarning,
} from "@/shared/components/ui/AlertasPersonalizados/toastAlerta";

export const useEndereco = () => {
  const { userData } = useAuth();
  const idUsuario = userData?.sub;
  const role = userData?.role;
  const navigate = useNavigate();

  const searchInput = useRef<HTMLInputElement | null>(null);
  const [address, setAddress] = useState<IEndereco | null>(null);
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [tipo, setTipo] = useState("");
  const [enderecoId, setEnderecoId] = useState<string | null>(null);

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

    const isIncomplete =
      !extracted.bairro || !extracted.cidade || !extracted.estado;

    if (isIncomplete && extracted.cep) {
      const viaCepData = await fetchViaCep(extracted.cep);
      setAddress((prev) => ({
        ...prev,
        bairro: extracted.bairro || viaCepData.bairro || prev?.bairro || "",
        cidade: extracted.cidade || viaCepData.localidade || prev?.cidade || "",
        estado: extracted.estado || viaCepData.uf || prev?.estado || "",
        pais: extracted.pais || prev?.pais || "Brasil",
        logradouro: prev?.logradouro || "",
        numero: prev?.numero || "",
        cep: prev?.cep || "",
        plain: prev?.plain || (() => ""),
      }));
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
      showError("Erro ao obter ID do endereço");
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

  const handleSubmit = async (
    e: React.FormEvent,
    tipo: "cadastrar" | "editar",
  ) => {
    e.preventDefault();
    if (!address || !numero)
      return showWarning("Por favor, preencha todos os campos do endereço.");
    if (!idUsuario) return showWarning("Erro ao obter ID do usuário.");

    const url = tipo === "cadastrar" ? "/endereco" : `/endereco/${enderecoId}`;
    const method = tipo === "cadastrar" ? api.post : api.put;

    try {
      await method(url, {
        data: buildEnderecoPayload(),
      });
      showSuccess(
        `Endereço ${tipo === "cadastrar" ? "cadastrado" : "atualizado"} com sucesso!`,
      );
      limparCampos();
      navigate("/");
    } catch (error) {
      console.error(`Erro ao ${tipo} endereço:`, error);
      showError(`Erro ao ${tipo} endereço. Tente novamente.`);
    }
  };

  const handleCadastrar = (e: React.FormEvent) => handleSubmit(e, "cadastrar");

  const handleEditar = (e: React.FormEvent) => {
    if (!enderecoId) return showError("Endereço não encontrado para edição.");
    handleSubmit(e, "editar");
  };

  useEffect(() => {
    const load = async () => {
      try {
        await initMapScript();
        initAutocomplete();
      } catch (error) {
        showError("Erro ao carregar o Google Maps");
        console.error("Erro ao carregar o Google Maps", error);
      }
    };
    load();
  }, [initAutocomplete]);

  useEffect(() => {
    if (!enderecoId && idUsuario) {
      const loadEnderecoId = async () => {
        const id = await getEnderecoId();
        setEnderecoId(id);
      };
      loadEnderecoId();
    }
  }, [idUsuario, enderecoId]);

  return {
    searchInput,
    address,
    numero,
    complemento,
    tipo,
    setNumero,
    setTipo,
    setComplemento,
    role,
    handleFavoritar,
    handleCadastrar,
    handleEditar,
    findMyLocation,
    fecharModal,
  };
};
