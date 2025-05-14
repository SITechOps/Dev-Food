import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/connection/axios";
import { IRestaurante } from "@/interface/IRestaurante";
import { IProduto } from "@/interface/IProduct";


let cacheRestaurantes: IRestaurante[] = [];
let cacheProdutos: IProduto[] = [];
let cacheProdutosAll: IProduto[] = [];


interface RestauranteProdutoContextProps {
  restaurantes: IRestaurante[];
  produtos: IProduto[];
  produtosAll: IProduto[];
  loading: boolean;
  getRestauranteById: (id: string) => IRestaurante | undefined;
  getProdutoById: (id: string) => IProduto | undefined;
  restauranteSelecionado: IRestaurante | null;
  setRestauranteSelecionado: (restaurante: IRestaurante) => void;
}

const RestauranteProdutoContext = createContext<RestauranteProdutoContextProps>({
  restaurantes: [],
  produtos: [],
  produtosAll: [],
  loading: true,
  getRestauranteById: () => undefined,
  getProdutoById: () => undefined,
  restauranteSelecionado: null,
  setRestauranteSelecionado: () => { },
});

export const useRestauranteProduto = () => useContext(RestauranteProdutoContext);

export const RestauranteProdutoProvider = ({ children }: { children: React.ReactNode }) => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [produtosAll, setProdutosAll] = useState<IProduto[]>([]);
  const [loading, setLoading] = useState(true);
  const [restauranteSelecionado, setRestauranteSelecionado] = useState<IRestaurante | null>(null);
  const restaurantesMemo = useMemo(() => restaurantes, [restaurantes]);
  const produtosMemo = useMemo(() => produtos, [produtos]);
  const produtosAllMemo = useMemo(() => produtosAll, [produtosAll]);
  const carregouRef = useRef(false);


  const getRestauranteAll = async () => {
    if (cacheRestaurantes.length > 0 && (cacheProdutos.length > 0 || cacheProdutosAll.length > 0)) {
      setRestaurantes(cacheRestaurantes);
      setProdutos(cacheProdutos);
      setProdutosAll(cacheProdutosAll);
      setLoading(false);
      return;
    }

    try {
      const responseRestaurantes = await api.get("/restaurantes");
      const restaurantesData: IRestaurante[] = responseRestaurantes.data.data.attributes || [];
      if (restaurantesData.length > 0) {
        cacheRestaurantes = restaurantesData;
        console.log("restaurantesData", restaurantesData);
        return setRestaurantes(restaurantesData);
      }

    } catch (erroGeral) {
      console.error("Erro ao buscar dados de restaurante/produtos:", erroGeral);
    }

    setLoading(false);
  };


  async function getProdutoAll() {
    try {
      const responseProdutos = await api.get("/produtos");

      const produtosData: IProduto[] = responseProdutos.data.data.attributes || [];

      console.log("produtosData", produtosData);

      setProdutosAll(produtosData);
      cacheProdutosAll = produtosData;

    } catch (erroProduto) {
      console.error("Erro ao buscar todos os produtos:", erroProduto);
    } finally {
      setLoading(false);
    }
  }


  async function getProduto(id: string) {
    const todosProdutos: IProduto[] = [];
    try {
      const responseProdutos = await api.get(`/restaurante/${id}/produtos`);

      const produtosData: IProduto[] = responseProdutos.data.data.attributes || [];

      const produtosComRestaurante = produtosData.map(produto => ({
        ...produto,
        id_restaurante: id,
        restaurantes,
      }));

      todosProdutos.push(...produtosComRestaurante);
    } catch (erroProduto) {
      console.error(`Erro ao buscar produtos do restaurante ${id}`, erroProduto);
    }
    setLoading(false);
    return setProdutos(todosProdutos);
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

  const getProdutoById = useCallback((id: string) => {
    return produtos.find((produto) => produto.id === id);
  }, [produtos]);


  return (
    <RestauranteProdutoContext.Provider
      value={{
        restaurantes: restaurantesMemo,
        produtos: produtosMemo,
        produtosAll: produtosAllMemo,
        loading,
        getRestauranteById,
        getProdutoById,
        restauranteSelecionado,
        setRestauranteSelecionado,
      }}
    >
      {children}
    </RestauranteProdutoContext.Provider>
  );
};
