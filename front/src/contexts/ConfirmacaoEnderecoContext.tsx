
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IRestaurante } from "@/interface/IRestaurante";
import { geocodeTexto } from "@/utils/useGeocode";
import { calcularDistancia } from "@/utils/useDistanceMatrix";
import { calcularTaxaEntrega } from "@/utils/calculateDeliveryFee";
import { initMapScript } from "@/utils/initMapScript";
import { IEndereco } from "@/interface/IEndereco";
import { useRestauranteProduto } from "./VisaoCliente/Restaurante&ProdutoContext";
import { useNavigate } from "react-router";

interface Coordenadas {
  lat: number;
  lng: number;
}

interface ConfirmacaoPadraoState {
  show: boolean;
  endereco: IEndereco | null;
}

interface ConfirmacaoEnderecoContextProps {
  loading: boolean;
  cancelarConfirmacao: () => void;
  enderecoPadraoId: string | null;
  clienteCoords: Coordenadas | null;
  restaurantesCompletos: IRestaurante[];
  confirmacaoPadrao: ConfirmacaoPadraoState;
  mostrarConfirmacao: (endereco: IEndereco) => void;
  setEnderecoPadraoId: (id: string | null) => void;
  confirmarEnderecoPadrao: (endereco: IEndereco) => void;
  processarRestaurantes: (coords: Coordenadas, restaurantes: IRestaurante[]) => Promise<IRestaurante[]>;
  setRestaurantesCompletos: React.Dispatch<React.SetStateAction<IRestaurante[]>>;
  calcularTaxaEntrega: (distancia: number) => number;
}

const ConfirmacaoEnderecoContext = createContext<ConfirmacaoEnderecoContextProps | undefined>(undefined);

export const ConfirmacaoEnderecoProvider = ({ children }: { children: ReactNode }) => {
  const [confirmacaoPadrao, setConfirmacaoPadrao] = useState<ConfirmacaoPadraoState>({ show: false, endereco: null });
  const [loading, setLoading] = useState(true);
  const [enderecoPadraoId, setEnderecoPadraoId] = useState<string | null>(null);
  const [geoCliente, setGeoCliente] = useState<string | null>(null);
  const [clienteCoords, setClienteCoords] = useState<Coordenadas | null>(null);
  const [restaurantesCompletos, setRestaurantesCompletos] = useState<IRestaurante[]>([]);
  const cacheCoordenadasRestaurantes = new Map<string, Coordenadas>();
  const { restaurantes } = useRestauranteProduto();
  const navigate = useNavigate();

  const setEnderecoPadraoIdSync = (id: string | null) => {
    const atual = localStorage.getItem("enderecoPadraoId");
    setEnderecoPadraoId(id);
    if (atual === id) return; 

    id ? localStorage.setItem("enderecoPadraoId", id) : localStorage.removeItem("enderecoPadraoId");
  };

  const mostrarConfirmacao = (endereco: IEndereco) => setConfirmacaoPadrao({ show: true, endereco });
  const cancelarConfirmacao = () => setConfirmacaoPadrao({ show: false, endereco: null });

  const confirmarEnderecoPadrao = (endereco: IEndereco) => {
    if (!endereco.id) return alert("Endereço não encontrado");

    localStorage.setItem("enderecoPadrao", JSON.stringify(endereco));
    setEnderecoPadraoIdSync(endereco.id);
    setConfirmacaoPadrao({ show: false, endereco: null });
    setLoading(false);
    navigate("/");
  };

  function montarEnderecoCompleto(endereco: IEndereco): string {
    return `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}, ${endereco.pais}`;
  }

  useEffect(() => {
    const geocodificar = async () => {
    if (!enderecoPadraoId || geoCliente === enderecoPadraoId) {
      setLoading(false);
      return;
    }

      const enderecoStr = localStorage.getItem("enderecoPadrao");
      const coordenadasSalvasStr = localStorage.getItem("geoCoordenadasCliente");
      const storageGeoEndereco = coordenadasSalvasStr ? JSON.parse(coordenadasSalvasStr) : null;

      try {
        const endereco: IEndereco = JSON.parse(enderecoStr || "");
        const enderecoCompleto = montarEnderecoCompleto(endereco);
        const idSalvo = storageGeoEndereco?.id?.trim?.();
        const idAtual = enderecoPadraoId.trim();

        console.log("Valores:", "(Geocode)", idSalvo, "(Endereço Selecionado)", idAtual);
        console.log("Comparação estrita:", idSalvo !== idAtual);

        if (!idSalvo || idSalvo !== idAtual) {
          console.log("Coordenadas novas serão buscadas...");
          const coords = await geocodeTexto(enderecoCompleto);
          if (coords) {
            setClienteCoords(coords);
            setGeoCliente(enderecoPadraoId);
            await processarRestaurantes(coords, restaurantes);
          }
        } else {
          console.log("Usando coordenadas já salvas.");
          if (storageGeoEndereco?.coords) {
            setClienteCoords(storageGeoEndereco.coords);
            setGeoCliente(enderecoPadraoId);
            await processarRestaurantes(storageGeoEndereco.coords, restaurantes);
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

    const enderecoCompleto = montarEnderecoCompleto(rest.endereco);
    const coord = await geocodeTexto(enderecoCompleto);

    if (coord) {
      cacheCoordenadasRestaurantes.set(chaveCache, coord);
      localStorage.setItem(storageKey, JSON.stringify(coord));
    }
    return coord;
  }

  async function processarRestaurantes(coords: Coordenadas, restaurantes: IRestaurante[]): Promise<IRestaurante[]> {
    try {
      await initMapScript();

      const atualizados = await Promise.all(
        restaurantes.map(async (rest) => {
          const destino = await calcularCoordenadaRestaurante(rest, coords);
          if (!destino) return rest;

          try {
            const distanciaInfo = await calcularDistancia(coords, destino);
            const taxa_entrega = distanciaInfo.distance ? calcularTaxaEntrega(distanciaInfo.distance) : undefined;

            const dadosCompletos = {
              ...rest,
              distancia: distanciaInfo.distance,
              duration: distanciaInfo.duration,
              taxa_entrega,
            };

            const geoCliente = {
              id: enderecoPadraoId,
              coords: clienteCoords,
            };

            const cacheKey = `restaurante_completo_${rest.id}_${destino.lat}_${destino.lng}`;
            localStorage.setItem(cacheKey, JSON.stringify(dadosCompletos));
            localStorage.setItem("geoCoordenadasCliente", JSON.stringify(geoCliente));

            return dadosCompletos;
          } catch (err) {
            console.error(`Erro ao calcular distância para ${rest.nome}:`, err);
            return {
              ...rest,
              distancia: null,
              duration: null,
              taxa_entrega: undefined,
            };
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