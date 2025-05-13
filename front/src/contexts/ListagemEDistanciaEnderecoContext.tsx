import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IAddress } from "../interface/IAddress";
import { geocodeTexto } from "../utils/useGeocode";
import { initMapScript } from "@/utils/initMapScript";
import { api } from "@/connection/axios";
import { IRestaurante } from "@/interface/IRestaurante";
import { calcularDistancia } from "@/utils/useDistanceMatrix";
import { calcularTaxaEntrega } from "@/utils/calculateDeliveryFee";

interface ConfirmacaoPadraoState {
  show: boolean;
  endereco: IAddress | null;
}

interface Coordenadas {
  lat: number;
  lng: number;
}

interface RestauranteComDistancia extends IRestaurante {
  distancia: number | undefined;
  duration: number | undefined;
  taxaEntrega: number | undefined;
}

interface ConfirmacaoEnderecoContextProps {
  confirmacaoPadrao: ConfirmacaoPadraoState;
  mostrarConfirmacao: (endereco: IAddress) => void;
  confirmarEnderecoPadrao: (endereco: IAddress) => void;
  cancelarConfirmacao: () => void;
  enderecoPadraoId: string | null;
  setEnderecoPadraoId: (id: string | null) => void;
  clienteCoords: Coordenadas | null;
  processarRestaurantes: (coords: { lat: number; lng: number }) => Promise<IRestaurante[]>;
  restaurantesCompletos: IRestaurante[];
  setRestaurantesCompletos: React.Dispatch<React.SetStateAction<IRestaurante[]>>;
  calcularTaxaEntrega: (distancia: number) => number; 
}

const ConfirmacaoEnderecoContext = createContext<ConfirmacaoEnderecoContextProps | undefined>(undefined);

export const ConfirmacaoEnderecoProvider = ({ children }: { children: ReactNode }) => {
  const [confirmacaoPadrao, setConfirmacaoPadrao] = useState<ConfirmacaoPadraoState>({
    show: false,
    endereco: null,
  });

  const [enderecoPadraoId, setEnderecoPadraoId] = useState<string | null>(null);
  const [clienteCoords, setClienteCoords] = useState<Coordenadas | null>(null);
  const [restaurantesCompletos, setRestaurantesCompletos] = useState<IRestaurante[]>([]);

  const mostrarConfirmacao = (endereco: IAddress) => {
    setConfirmacaoPadrao({ show: true, endereco });
  };

  const confirmarEnderecoPadrao = (endereco: IAddress) => {
    if (!endereco.id) {
      return alert("Endereço não encontrado");
    }

    localStorage.setItem("enderecoPadraoId", endereco.id);
    localStorage.setItem("enderecoPadrao", JSON.stringify(endereco));

    setEnderecoPadraoId(endereco.id);
    setConfirmacaoPadrao({ show: false, endereco: null });
  };

  const cancelarConfirmacao = () => {
    setConfirmacaoPadrao({ show: false, endereco: null });
  };

  useEffect(() => {
    async function geocodificarEnderecoPadrao() {
      if (!enderecoPadraoId) {
        setClienteCoords(null);
        return;
      }

      const enderecoPadraoString = localStorage.getItem("enderecoPadrao");
      if (!enderecoPadraoString) return;

      try {
        const endereco: IAddress = JSON.parse(enderecoPadraoString);
        const enderecoCompleto = `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}, ${endereco.pais}`;

        const coords = await geocodeTexto(enderecoCompleto);
        if (coords) {
          setClienteCoords(coords);
        } else {
          console.warn("Coordenadas não encontradas para o endereço padrão.");
        }
      } catch (error) {
        console.error("Erro ao geocodificar o endereço:", error);
      }
    }

    geocodificarEnderecoPadrao();
  }, [enderecoPadraoId]);  // Agora o useEffect só depende de enderecoPadraoId

  const processarRestaurantes = async (coords: { lat: number; lng: number }) => {
    try {
      await initMapScript();
  
      const response = await api.get("/restaurantes");
      const restaurantes: IRestaurante[] = response.data?.data?.attributes || [];
  
      const atualizados = await Promise.all(
        restaurantes.map(async (rest) => {
          const enderecoCompleto = `${rest.endereco.logradouro}, ${rest.endereco.numero}, ${rest.endereco.bairro}, ${rest.endereco.cidade}, ${rest.endereco.estado}, ${rest.endereco.pais}`;
          const destino = await geocodeTexto(enderecoCompleto);
          if (!destino) return rest;
  
          try {
            const distanciaInfo = await calcularDistancia(coords, destino);
  
            const taxaEntrega = distanciaInfo.distance
              ? calcularTaxaEntrega(distanciaInfo.distance)
              : undefined;
  
            return {
              ...rest,
              distancia: distanciaInfo.distance,
              duration: distanciaInfo.duration,
              taxaEntrega,
            } as RestauranteComDistancia;
          } catch (err) {
            console.error(`Erro ao calcular distância para ${rest.nome}:`, err);
            return rest;
          }
        })
      );
  
      return atualizados; 
    } catch (error) {
      console.error("Erro ao processar restaurantes:", error);
      return []; 
    }
  };

  return (
    <ConfirmacaoEnderecoContext.Provider
      value={{
        confirmacaoPadrao,
        mostrarConfirmacao,
        confirmarEnderecoPadrao,
        cancelarConfirmacao,
        enderecoPadraoId,
        setEnderecoPadraoId,
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
