import { useEffect, useState, useMemo, useRef } from "react";
import { api } from "../connection/axios";
import RestauranteCard from "../components/Restaurante/RestaurantCard";
import ProdutoCard from "../components/Produto/ProdutoCard";
import { Link } from "react-router-dom";
import { geocodeTexto } from "../utils/useGeocode";
import { calcularDistancia } from "../utils/useDistanceMatrix";
import { calcularTaxaEntrega } from "../utils/calculateDeliveryFee";
import { useAuth } from "../contexts/AuthContext";
import Categorias from "./RestaurantesDisponiveis/Categorias";

// Tipagens explícitas
interface Endereco {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}

interface Restaurante {
  id: string;
  nome: string;
  especialidade?: string;
  endereco: Endereco;
  distancia?: string;
  taxaEntrega?: number;
}

interface Produto {
  id: string;
  nome: string;
  id_restaurante: string;
  restaurante?: Restaurante;
  [key: string]: any;
}

export default function Home() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [abaAtiva, setAbaAtiva] = useState("restaurantes");
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const { userData, token } = useAuth();
  const idUsuario = userData?.sub;
  const [clienteCoords, setClienteCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const processamentoFeitoRef = useRef(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const restaurantesProximos = useMemo(() => {
    return restaurantes
      .filter((restaurante) => {
        if (!restaurante.distancia) return false;
        const distanciaNum = parseFloat(restaurante.distancia);
        return !isNaN(distanciaNum) && distanciaNum <= 10;
      })
      .sort((a, b) => parseFloat(a.distancia!) - parseFloat(b.distancia!));
  }, [restaurantes]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    async function obterEnderecoCliente() {
      try {
        if (!idUsuario || !token) return;

        const response = await api.get(`/user/${idUsuario}/enderecos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const endereco = response.data?.data?.attributes[0];

        if (!endereco) return;

        const enderecoCompleto = `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}, ${endereco.pais}`;
        const coords = await geocodeTexto(enderecoCompleto);

        if (coords) setClienteCoords(coords);
      } catch (error) {
        console.error(
          "Erro ao buscar/geocodificar endereço do cliente:",
          error,
        );
      }
    }

    obterEnderecoCliente();
  }, [idUsuario, token]);

      useEffect(() => {
        async function listarRestaurantes() {
            try {
                const response = await api.get("/restaurantes");
                const data: Restaurante[] = response?.data?.data?.attributes || [];
                        setRestaurantes(data);
            } catch (error) {
                console.error("Erro ao buscar restaurantes:", error);
            }
        }

    listarRestaurantes();
  }, []);

  useEffect(() => {
    async function listarProdutosPorRestaurante() {
      try {
        const allProdutos: Produto[] = [];

        for (const restaurante of restaurantes) {
          const response = await api.get(
            `/restaurante/${restaurante.id}/produtos`,
          );
          const produtos: Produto[] = response?.data?.data?.attributes || [];

          const produtosComRestaurante = produtos.map((produto) => ({
            ...produto,
            id_restaurante: restaurante.id,
            restaurante,
          }));

          allProdutos.push(...produtosComRestaurante);
        }

        setProdutos(allProdutos);
      } catch (error) {
        console.error("Erro ao buscar produtos por restaurante:", error);
      }
    }

    if (restaurantes.length > 0) {
      listarProdutosPorRestaurante();
    }
  }, [restaurantes]);

  // Processar distância e taxa de entrega
  useEffect(() => {
    async function processarRestaurantes() {
      if (
        !clienteCoords ||
        restaurantes.length === 0 ||
        processamentoFeitoRef.current
      )
        return;

      const atualizados: Restaurante[] = await Promise.all(
        restaurantes.map(async (rest) => {
          const enderecoCompletoRestaurante = `${rest.endereco.logradouro}, ${rest.endereco.numero}, ${rest.endereco.bairro}, ${rest.endereco.cidade}, ${rest.endereco.estado}, ${rest.endereco.pais}`;

          const destino = await geocodeTexto(enderecoCompletoRestaurante);
          if (!destino) return rest;

          try {
            const distanciaInfo = await calcularDistancia(
              clienteCoords,
              destino,
            );

            const taxaEntrega =
              distanciaInfo.distance != null
                ? calcularTaxaEntrega(distanciaInfo.distance)
                : undefined;

            return {
              ...rest,
              distancia: distanciaInfo.distance?.toFixed(1),
              duration: distanciaInfo.duration,
              taxaEntrega,
            };
          } catch (err) {
            console.error(`Erro ao calcular distância para ${rest.nome}:`, err);
            return rest;
          }
        }),
      );

      setRestaurantes(atualizados);

      processamentoFeitoRef.current = true;
    }

    processarRestaurantes();
  }, [restaurantes, clienteCoords]);

  const filteredRestaurantes = useMemo(() => {
    return restaurantes.filter((restaurante) => {
      const nomeMatch = restaurante.nome
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const produtosDoRestaurante = produtos.filter(
        (produto) => produto.id_restaurante === restaurante.id,
      );
      const produtoMatch = produtosDoRestaurante.some((produto) =>
        produto.nome?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      const categoriaMatch =
        !selectedCategory ||
        selectedCategory === "Todos" ||
        restaurante.especialidade === selectedCategory;
      return (nomeMatch || produtoMatch) && categoriaMatch;
    });
  }, [restaurantes, produtos, searchTerm, selectedCategory]);

  const produtosFiltrados = useMemo(() => {
    return produtos
      .map((produto) => {
        const restaurante = restaurantes.find(
          (r) => r.id === produto.id_restaurante,
        );
        return { ...produto, restaurante };
      })
      .filter((produto) => {
        const nomeMatch = produto.nome
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const categoriaMatch =
          !selectedCategory ||
          selectedCategory === "Todos" ||
          produto.restaurante?.especialidade === selectedCategory;
        return nomeMatch && categoriaMatch;
      });
  }, [produtos, restaurantes, searchTerm, selectedCategory]);

  return (
    <div className="mt-[5rem]">
      <h1 className="my-8 text-center font-medium">
        Conheça os restaurantes disponíveis
      </h1>
      <div className="mx-auto mb-8 max-w-md">
        <input
          type="text"
          placeholder="Buscar por restaurante ou item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-medium w-full rounded-md px-4 py-2 shadow-sm"
        />
      </div>
      <h2 className="text-blue mb-4 text-2xl font-semibold">
        Pedir seu delivery no iFood é rápido e prático! Conheça as categorias
      </h2>
      <Categorias onCategoryClick={handleCategoryClick} />
      {abaAtiva === "restaurantes" && restaurantesProximos.length > 0 && (
        <div className="mb-10">
          <h2 className="text-blue mt-6 mb-4 text-xl font-semibold">
            Restaurantes Próximos (até 10km)
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {restaurantesProximos.map((restaurante) => (
              <Link to={`/restaurante/${restaurante.id}`} key={restaurante.id}>
                <RestauranteCard restaurante={restaurante} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Aba de seleção */}
      <div className="mt-6 mb-6 flex border-b border-gray-300">
        <button
          className={`px-4 py-2 font-bold ${abaAtiva === "restaurantes" ? "border-b-brown-normal text-brown-normal border-b-2 font-extrabold" : ""}`}
          onClick={() => setAbaAtiva("restaurantes")}
        >
          Restaurantes
        </button>
        <button
          className={`px-4 py-2 font-bold ${abaAtiva === "itens" ? "border-b-brown-normal text-brown-normal border-b-2 font-extrabold" : ""}`}
          onClick={() => setAbaAtiva("itens")}
        >
          Itens
        </button>
      </div>

            {/* Grid principal */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {abaAtiva === "restaurantes" &&
                    filteredRestaurantes.map((restaurante) => (
                        <Link to={`/restaurante/${restaurante.id}`} key={restaurante.id} onClick={() => {
                            const restauranteComFrete = {
                              ...restaurante,
                              distancia: restaurante.distancia,
                              duration: restaurante.duration,
                              taxaEntrega: restaurante.taxaEntrega,
                            };
                        
                            localStorage.setItem("restauranteSelecionado", JSON.stringify(restauranteComFrete));
                          }}>
                            <RestauranteCard restaurante={restaurante} />
                        </Link>
                    ))}

        {abaAtiva === "itens" &&
          produtosFiltrados.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
      </div>
    </div>
  );
}