import { useEffect, useState } from "react";
import { api } from "../connection/axios";
import Card from "../pages/RestaurantesDisponiveis/Card";
import Categorias from "./RestaurantesDisponiveis/Categorias";
import Input from "../components/ui/Input";
import { Search } from "lucide-react";

export default function Home() {
  const [restaurantes, setRestaurantes] = useState([
    {
      id: "",
      especialidade: "",
      nome: "",
      img: "",
      avaliacao: 0,
      categoria: "",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRestaurants = restaurantes.filter((restaurant) => {
    const matchesSearchTerm = restaurant.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "Todos" ||
      restaurant.especialidade === selectedCategory;

    return matchesSearchTerm && matchesCategory;
  });

  useEffect(() => {
    async function listarRestaurantes() {
      try {
        const response = await api.get("/restaurantes");
        const data = response?.data?.data?.attributes || [];

        const formattedData = data.map((restaurante: any) => ({
          id: restaurante.id,
          nome: restaurante.nome,
          especialidade: restaurante.especialidade,
          img: restaurante.imagemUrl,
          avaliacao: restaurante.avaliacao || 4.0,
          categoria: restaurante.categoria || "Sem Categoria",
        }));

        setRestaurantes(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar restaurantes:", error);
        setLoading(false);
      }
    }

    listarRestaurantes();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <div className="mt-[5rem]">
        <h1 className="my-8 text-center font-medium">
          Conheça os restaurantes disponíveis
        </h1>
        <div className="mt-[5rem]">
          <div className="mx-auto max-w-7xl space-y-8 px-4 py-6">
            <div className="relative w-full max-w-sm">
              <Search
                className="text-gray-medium absolute top-1/2 left-3 -translate-y-1/2"
                size={18}
              />
              <Input
                type="text"
                placeholder="Pesquisar Restaurante"
                className="!mt-0 h-full !w-2xs !bg-white !pl-10"
                onChange={handleSearch}
              />
            </div>
            <h2 className="text-blue text-2xl font-semibold">
              Pedir seu delivery no iFood é rápido e prático! Conheça as
              categorias
            </h2>
            <Categorias onCategoryClick={handleCategoryClick} />
            <h2 className="text-blue text-2xl font-semibold">Restaurantes</h2>
            {loading ? (
              <div className="space-y-8">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx}>
                    <div className="mb-2 h-6 w-32 rounded bg-gray-200" />
                    <div className="flex gap-4">
                      {[...Array(5)].map((__, i) => (
                        <div
                          className="h-48 w-60 animate-pulse rounded-2xl bg-gray-200"
                          key={i}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredRestaurants.map((restaurante, index) => (
                  <Card
                    key={restaurante.id || `restaurante-${index}`}
                    content={{
                      id: restaurante.id,
                      nome: restaurante.nome,
                      img: restaurante.img,
                      avaliacao: restaurante.avaliacao,
                      categoria: restaurante.categoria,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
