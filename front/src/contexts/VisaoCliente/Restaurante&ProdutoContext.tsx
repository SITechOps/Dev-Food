import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/connection/axios";
import { IRestaurante } from "@/interface/IRestaurante";
import { IProduto } from "@/interface/IProduto";
import { showError } from "@/components/ui/AlertasPersonalizados/toastAlerta";


let cacheRestaurantes: IRestaurante[] = [];
let cacheProdutosAll: IProduto[] = [];

interface RestauranteProdutoContextProps {
  restaurantes: IRestaurante[];
  produtosAll: IProduto[];
  loading: boolean;
  getRestauranteById: (id: string) => IRestaurante | undefined;
  restauranteSelecionado: IRestaurante | null;
  setRestauranteSelecionado: (restaurante: IRestaurante) => void;
}

const RestauranteProdutoContext = createContext<RestauranteProdutoContextProps>({
  restaurantes: [],
  produtosAll: [],
  loading: true,
  getRestauranteById: () => undefined,
  restauranteSelecionado: null,
  setRestauranteSelecionado: () => { },
});

export const useRestauranteProduto = () => useContext(RestauranteProdutoContext);

export const RestauranteProdutoProvider = ({ children }: { children: React.ReactNode }) => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [produtosAll, setProdutosAll] = useState<IProduto[]>([]);
  const [loading, setLoading] = useState(true);
  const [restauranteSelecionado, setRestauranteSelecionado] = useState<IRestaurante | null>(null);
  const restaurantesMemo = useMemo(() => restaurantes, [restaurantes]);
  const produtosAllMemo = useMemo(() => produtosAll, [produtosAll]);
  const carregouRef = useRef(false);


  const getRestauranteAll = async () => {
    if (cacheRestaurantes.length > 0 && cacheProdutosAll.length > 0) {
      setRestaurantes(cacheRestaurantes);
      setProdutosAll(cacheProdutosAll);
      setLoading(false);
      return;
    }

    try {
      const responseRestaurantes = await api.get("/restaurantes");
      const restaurantesData: IRestaurante[] = responseRestaurantes.data.data.attributes || [];
      if (restaurantesData.length > 0) {
        cacheRestaurantes = restaurantesData;
        return setRestaurantes(restaurantesData);
      }

    } catch (erroGeral) {
      showError("Erro ao buscar dados de restaurante/produtos");
      console.error("Erro ao buscar dados de restaurante/produtos:", erroGeral);
    }

    setLoading(false);
  };


  async function getProdutoAll() {
    try {
      const responseProdutos = await api.get("/produtos");

      const produtosData: IProduto[] = responseProdutos.data.data.attributes || [];

      setProdutosAll(produtosData);
      cacheProdutosAll = produtosData;

    } catch (erroProduto) {
      showError("Erro ao buscar todos os produtos");
      console.error("Erro ao buscar todos os produtos:", erroProduto);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (carregouRef.current) return;

    getRestauranteAll();
    getProdutoAll();
    carregouRef.current = true;
  }, []);

  const getRestauranteById = useCallback((id: string) => {
    return restaurantes.find((restaurante) => restaurante.id === id);
  }, [restaurantes]);


  return (
    <RestauranteProdutoContext.Provider
      value={{
        restaurantes: restaurantesMemo,
        produtosAll: produtosAllMemo,
        loading,
        getRestauranteById,
        restauranteSelecionado,
        setRestauranteSelecionado,
      }}
    >
      {children}
    </RestauranteProdutoContext.Provider>
  );
};
