
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IAddress } from "../interface/IAddress";
import { IRestaurante } from "@/interface/IRestaurante";
import { api } from "@/connection/axios";
import { geocodeTexto } from "@/utils/useGeocode";
import { calcularDistancia } from "@/utils/useDistanceMatrix";
import { calcularTaxaEntrega } from "@/utils/calculateDeliveryFee";
import { initMapScript } from "@/utils/initMapScript";

interface Coordenadas {
  lat: number;
  lng: number;
}

interface ConfirmacaoPadraoState {
  show: boolean;
  endereco: IAddress | null;
}

interface ConfirmacaoEnderecoContextProps {
  loading: boolean;
  confirmacaoPadrao: ConfirmacaoPadraoState;
  mostrarConfirmacao: (endereco: IAddress) => void;
  confirmarEnderecoPadrao: (endereco: IAddress) => void;
  cancelarConfirmacao: () => void;
  enderecoPadraoId: string | null;
  setEnderecoPadraoId: (id: string | null) => void;
  clienteCoords: Coordenadas | null;
  processarRestaurantes: (coords: Coordenadas) => Promise<IRestaurante[]>;
  restaurantesCompletos: IRestaurante[];
  setRestaurantesCompletos: React.Dispatch<React.SetStateAction<IRestaurante[]>>;
  calcularTaxaEntrega: (distancia: number) => number;
}

const ConfirmacaoEnderecoContext = createContext<ConfirmacaoEnderecoContextProps | undefined>(undefined);

export const ConfirmacaoEnderecoProvider = ({ children }: { children: ReactNode }) => {
  const [confirmacaoPadrao, setConfirmacaoPadrao] = useState<ConfirmacaoPadraoState>({ show: false, endereco: null });
  const [loading, setLoading] = useState(true);
  const [enderecoPadraoId, setEnderecoPadraoId] = useState<string | null>(null);
  const [clienteCoords, setClienteCoords] = useState<Coordenadas | null>(null);
  const [restaurantesCompletos, setRestaurantesCompletos] = useState<IRestaurante[]>([]);
  const cacheCoordenadasRestaurantes = new Map<string, Coordenadas>();

  const setEnderecoPadraoIdSync = (id: string | null) => {
    id ? localStorage.setItem("enderecoPadraoId", id) : localStorage.removeItem("enderecoPadraoId");
    setEnderecoPadraoId(id);
  };

  const mostrarConfirmacao = (endereco: IAddress) => setConfirmacaoPadrao({ show: true, endereco });

  const confirmarEnderecoPadrao = (endereco: IAddress) => {
    if (!endereco.id) return alert("Endereço não encontrado");

    localStorage.setItem("enderecoPadrao", JSON.stringify(endereco));
    setEnderecoPadraoIdSync(endereco.id);
    setConfirmacaoPadrao({ show: false, endereco: null });
    setLoading(false);
  };

  const cancelarConfirmacao = () => setConfirmacaoPadrao({ show: false, endereco: null });

  useEffect(() => {
    const enderecoSalvoId = localStorage.getItem("enderecoPadraoId");
    enderecoSalvoId ? setEnderecoPadraoId(enderecoSalvoId) : setLoading(false);

    const geocodificar = async () => {
      if (!enderecoPadraoId) return setLoading(false);

      const enderecoStr = localStorage.getItem("enderecoPadrao");
      const coordenadasSalvasStr = localStorage.getItem("geoCoordenadasCliente");

      if (!enderecoStr) return setLoading(false);

      try {
        const endereco: IAddress = JSON.parse(enderecoStr);
        const coordenadasSalvas = coordenadasSalvasStr ? JSON.parse(coordenadasSalvasStr) : null;

        if (coordenadasSalvas?.id === enderecoPadraoId) {
          setClienteCoords(coordenadasSalvas.coords);
        } else {
          const enderecoCompleto = `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}, ${endereco.pais}`;
          const coords = await geocodeTexto(enderecoCompleto);
          if (coords) {
            setClienteCoords(coords);
            localStorage.setItem("geoCoordenadasCliente", JSON.stringify({ id: enderecoPadraoId, coords }));
          }
        }
      } catch (error) {
        console.error("Erro ao processar coordenadas do endereço:", error);
      } finally {
        setLoading(false);
      }
    };

    geocodificar();
  }, [enderecoPadraoId]);

  async function calcularCoordenadaRestaurante(rest: IRestaurante, clienteCoords: Coordenadas) {
    const chaveCache = `${rest.id}_${clienteCoords.lat}_${clienteCoords.lng}`;
    const storageKey = `geoCoordenadasRestaurante_${rest.id}`;

    if (cacheCoordenadasRestaurantes.has(chaveCache)) {
      return cacheCoordenadasRestaurantes.get(chaveCache)!;
    }

    const salvaStr = localStorage.getItem(storageKey);
    if (salvaStr) {
      const coord = JSON.parse(salvaStr);
      cacheCoordenadasRestaurantes.set(chaveCache, coord);
      return coord;
    }

    const enderecoCompleto = `${rest.endereco.logradouro}, ${rest.endereco.numero}, ${rest.endereco.bairro}, ${rest.endereco.cidade}, ${rest.endereco.estado}, ${rest.endereco.pais}`;
    const coord = await geocodeTexto(enderecoCompleto);

    if (coord) {
      cacheCoordenadasRestaurantes.set(chaveCache, coord);
      localStorage.setItem(storageKey, JSON.stringify(coord));
    }

    return coord;
  }

  async function processarRestaurantes(coords: Coordenadas): Promise<IRestaurante[]> {
    try {
      await initMapScript();
      const response = await api.get("/restaurantes");
      const restaurantes: IRestaurante[] = response.data?.data?.attributes || [];

      const atualizados = await Promise.all(
        restaurantes.map(async (rest) => {
          const destino = await calcularCoordenadaRestaurante(rest, coords);
          if (!destino) return rest;

          const cacheKey = `restaurante_completo_${rest.id}_${destino.lat}_${destino.lng}`;
          const dadosSalvos = localStorage.getItem(cacheKey);

          if (dadosSalvos) return JSON.parse(dadosSalvos);

          try {
            const distanciaInfo = await calcularDistancia(coords, destino);
            const taxa_entrega = distanciaInfo.distance ? calcularTaxaEntrega(distanciaInfo.distance) : undefined;

            const dadosCompletos = {
              ...rest,
              distancia: distanciaInfo.distance,
              duration: distanciaInfo.duration,
              taxa_entrega,
            };

            localStorage.setItem(cacheKey, JSON.stringify(dadosCompletos));
            return dadosCompletos;
          } catch (err) {
            console.error(`Erro ao calcular distância para ${rest.nome}:`, err);
            return { ...rest, distancia: undefined, duration: undefined, taxa_entrega: undefined };
          }
        })
      );

      setRestaurantesCompletos(atualizados);
      return atualizados;
    } catch (error) {
      console.error("Erro ao processar restaurantes:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  return (
    <ConfirmacaoEnderecoContext.Provider
      value={{
        loading,
        confirmacaoPadrao,
        mostrarConfirmacao,
        confirmarEnderecoPadrao,
        cancelarConfirmacao,
        enderecoPadraoId,
        setEnderecoPadraoId: setEnderecoPadraoIdSync,
        clienteCoords,
        processarRestaurantes,
        restaurantesCompletos,
        setRestaurantesCompletos,
        calcularTaxaEntrega,
      }}
    >
      {children}
    </ConfirmacaoEnderecoContext.Provider>
  );
};

export const useConfirmacaoEndereco = (): ConfirmacaoEnderecoContextProps => {
  const context = useContext(ConfirmacaoEnderecoContext);
  if (!context) {
    throw new Error("useConfirmacaoEndereco deve ser usado dentro de ConfirmacaoEnderecoProvider");
  }
  return context;
};
