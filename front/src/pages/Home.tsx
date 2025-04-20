import { useEffect, useState } from "react";
import { api } from "../connection/axios";
import RestauranteCardList from "../components/Restaurante/CardList";
import RestauranteCard from "../components/Restaurante/RestaurantCard";
import ProdutoCard from "../components/Produto/ProdutoCard";
import MiniRestauranteCard from "../components/Restaurante/MiniCard";
import { Link } from "react-router-dom";

export default function Home() {
  const [restaurantes, setRestaurantes] = useState<any[]>([]);
  const [abaAtiva, setAbaAtiva] = useState("restaurantes");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function listarProdutosPorRestaurante() {
      try {
        const allProdutos: any[] = [];

        for (const restaurante of restaurantes) {
          const response = await api.get(
            `/restaurante/${restaurante.id}/produtos`,
          );
          const produtos = response?.data?.data?.attributes || [];

          const produtosComRestaurante = produtos.map((produto: any) => ({
            ...produto,
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
    async function listarProdutos() {
      try {
        const response = await api.get("/produtos");
        const data = response?.data?.data?.attributes || [];
        setProdutos(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setLoading(false);
      }
    }

    listarProdutos();
  }, []);

  const filteredRestaurantes = restaurantes.filter((restaurante) => {
    const nomeMatch = restaurante.nome
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const produtosDoRestaurante = produtos.filter(
      (produto) => produto.id_restaurante === restaurante.id,
    );

    const produtoMatch = produtosDoRestaurante.some((produto) =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return nomeMatch || produtoMatch;
  });

  const grupoCategoria = filteredRestaurantes.reduce(
    (acc: any, item: any) => {
      const categoria = item.especialidade || "Outros";
      if (!acc[categoria]) acc[categoria] = [];
      acc[categoria].push(item);
      return acc;
    },
    {} as Record<string, typeof restaurantes>,
  );

  const produtosFiltrados = produtos
    .filter((produto) =>
      produto.nome?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .map((produto) => {
      const restaurante = restaurantes.find(
        (r) => r.id === produto.id_restaurante,
      );
      return { ...produto, restaurante };
    });

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
      <div className="mb-6 flex border-b border-gray-300">
        <button
          className={`px-4 py-2 font-medium ${
            abaAtiva === "restaurantes"
              ? "border-b-brown-normal border-b-2 text-red-500"
              : ""
          }`}
          onClick={() => setAbaAtiva("restaurantes")}
        >
          Restaurantes
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            abaAtiva === "itens"
              ? "border-b-brown-normal border-b-2 text-red-500"
              : ""
          }`}
          onClick={() => setAbaAtiva("itens")}
        >
          Itens
        </button>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {abaAtiva === "restaurantes" &&
          filteredRestaurantes.map((restaurante) => (
            <Link to={`/restaurante/${restaurante.id}`}>
              <RestauranteCard key={restaurante.id} restaurante={restaurante} />
            </Link>
          ))}

        {abaAtiva === "itens" &&
          produtosFiltrados.map((produto) => (
            <div key={produto.id} className="space-y-2">
              {produto.restaurante && (
                <Link to={`/restaurante/${produto.id_restaurante}`}>
                  <MiniRestauranteCard restaurante={produto.restaurante} />
                </Link>
              )}
              <ProdutoCard produto={produto} />
            </div>
          ))}
      </div>
    </div>
  );
}
