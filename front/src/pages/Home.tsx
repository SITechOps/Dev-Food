import { useEffect, useState, useMemo } from "react";
import { api } from "../connection/axios";
import RestauranteCard from "../components/Restaurante/RestaurantCard";
import ProdutoCard from "../components/Produto/ProdutoCard";
import { Link } from "react-router-dom";
import Categorias from "./RestaurantesDisponiveis/Categorias";
import Input from "@/components/ui/Input";
import { useConfirmacaoEndereco } from "@/contexts/ListagemEDistanciaEnderecoContext";
import { IRestaurante } from "@/interface/IRestaurante";
import { MapPin } from "lucide-react";
import { ImagemDeEntidade } from "@/components/ui/ImagemEntidade";

interface Produto {
  id: string;
  nome: string;
  id_restaurante: string;
  restaurante?: IRestaurante;
  [key: string]: any;
}

export default function Home() {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [abaAtiva, setAbaAtiva] = useState("restaurantes");
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filtroDistanciaAtivo, setFiltroDistanciaAtivo] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { processarRestaurantes, clienteCoords } = useConfirmacaoEndereco();

  const restaurantesProximos = useMemo(() => {
    return restaurantes
      .filter((restaurante) => {
        if (!restaurante.distancia) return false;
        const distanciaNum = restaurante.distancia;
        return !isNaN(distanciaNum) && distanciaNum <= 10;
      })
      .sort((a, b) => a.distancia! - b.distancia!);
  }, [restaurantes]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    async function listarRestaurantes() {
      try {
        const response = await api.get("/restaurantes");
        const data: IRestaurante[] = response?.data?.data?.attributes || [];
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

  useEffect(() => {
    async function carregarRestaurantes() {
      if (!clienteCoords) return;

      const restaurantesAtualizados =
        await processarRestaurantes(clienteCoords);
      setRestaurantes(restaurantesAtualizados);
    }
    carregarRestaurantes();
  }, [clienteCoords]);

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
      <h1 className="text-blue my-8 text-center font-medium">
        Conheça os restaurantes disponíveis
      </h1>
      <div className="mx-auto mb-8 max-w-md">
        <Input
          type="text"
          placeholder="Buscar por restaurante ou item..."
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
          className="bg-gray-medium w-full rounded-md px-4 py-2 shadow-sm"
        />
      </div>
      <h2 className="text-blue mb-4 text-2xl font-semibold">
        Pedir seu delivery no TechOps é rápido e prático! Conheça as categorias
      </h2>

      <Categorias onCategoryClick={handleCategoryClick} />

      <div className="mt-6 w-full">
        <button
          className={`flex items-center gap-2 rounded-[10px] px-6 py-2 text-sm font-semibold shadow-md transition-all duration-200 hover:shadow-lg ${
            filtroDistanciaAtivo
              ? "bg-brown-normal hover:bg-brown-dark text-white"
              : "text-brown-normal border-brown-normal hover:bg-brown-light border bg-white"
          }`}
          onClick={() => setFiltroDistanciaAtivo(!filtroDistanciaAtivo)}
        >
          <MapPin className="h-4 w-4" />
          Próximos de mim
        </button>
      </div>
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
          (filtroDistanciaAtivo
            ? restaurantesProximos
            : filteredRestaurantes
          ).map((restaurante) => (
            <Link
              to={`/restaurante/${restaurante.id}`}
              key={restaurante.id}
              onClick={() => {
                const restauranteComFrete = {
                  ...restaurante,
                  distancia: restaurante.distancia,
                  duration: restaurante.duration,
                  taxaEntrega: restaurante.taxa_entrega,
                };

                localStorage.setItem(
                  "restauranteSelecionado",
                  JSON.stringify(restauranteComFrete),
                );
              }}
            >
              <RestauranteCard restaurante={restaurante} />
            </Link>
          ))}

        {abaAtiva === "itens" && (
          <>
            {produtosFiltrados.map((produto) => (
              <div key={produto.id} className="mb-8">
                <div className="mb-3 flex items-center gap-4">
                  {produto.restaurante?.logo && (
                    <ImagemDeEntidade
                      src={produto.restaurante.logo}
                      alt={`Logo do restaurante ${produto.restaurante.nome}`}
                      className="h-12 w-12 rounded-full border object-cover"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="text-blue text-base font-semibold">
                      {produto.restaurante?.nome}
                    </span>
                    <span className="text-blue text-sm">
                      {produto.restaurante?.especialidade}
                      {produto.restaurante?.distancia &&
                        ` • ${produto.restaurante.distancia} km`}
                    </span>
                    <span className="text-green-dark text-sm font-medium">
                      {produto.restaurante?.taxaEntrega === 0 ||
                      produto.restaurante?.taxaEntrega === undefined
                        ? "Entrega grátis"
                        : `Entrega: R$ ${produto.restaurante?.taxaEntrega.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/restaurante/${produto.restaurante?.id}`}
                  onClick={() => {
                    const restauranteComFrete = {
                      ...produto.restaurante,
                      distancia: produto.restaurante?.distancia,
                      duration: produto.restaurante?.duration,
                      taxaEntrega: produto.restaurante?.taxaEntrega,
                    };
                    localStorage.setItem(
                      "restauranteSelecionado",
                      JSON.stringify(restauranteComFrete),
                    );
                  }}
                >
                  <ProdutoCard produto={produto} />
                </Link>
              </div>
            ))}

            {produtosFiltrados.length === 0 && (
              <div className="mt-4 h-40">
                <p className="text-blue col-span-full text-center text-lg">
                  Nenhum item encontrado
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
