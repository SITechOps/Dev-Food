import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import CardRestaurante from "./RestaurantesDisponiveis/Card";
import React from "react";
import { useRestauranteProduto } from "@/contexts/VisaoCliente/Restaurante&ProdutoContext";
import { useConfirmacaoEndereco } from "@/contexts/ConfirmacaoEnderecoContext";
import { useNavigate } from "react-router-dom";
import { IRestaurante } from "@/interface/IRestaurante";
import Categorias from "./RestaurantesDisponiveis/Filtros/FiltroCategorias";

export default function Home() {
  const navigate = useNavigate();
  const { restaurantes } = useRestauranteProduto();
  const CardRestauranteMemo = React.memo(CardRestaurante);
  const [mensagemErro, setMensagemErro] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [restaurantesCarregados, setRestaurantesCarregados] = useState(false);
  const [restaurantesFiltrados, setRestaurantesFiltrados] = useState<IRestaurante[]>([]);
  const { processarRestaurantes, clienteCoords, restaurantesCompletos } = useConfirmacaoEndereco();


  const handleCategoryClick = (category: string) => {
    console.log("Categoria selecionada:", category);
    setSelectedCategory(category);

    const categoriaSelecionada = category.toLowerCase();

    const baseRestaurantes =
      restaurantesCompletos.length > 0 ? restaurantesCompletos : restaurantes;

    if (categoriaSelecionada === "todos") {
      setRestaurantesFiltrados(baseRestaurantes);
      setMensagemErro("");
      return;
    }

    const filtrados = baseRestaurantes.filter((restaurante) =>
      restaurante.especialidade?.toLowerCase().includes(categoriaSelecionada)
    );

    if (filtrados.length > 0) {
      setRestaurantesFiltrados(filtrados);
      setMensagemErro("");
    } else {
      setRestaurantesFiltrados([]);
      setMensagemErro(`Nenhum restaurante encontrado com a categoria "${category}"`);
    }
  };

  useEffect(() => {
    if (clienteCoords && !restaurantesCarregados) {
      processarRestaurantes(clienteCoords);
      setRestaurantesCarregados(true);
    }
  }, [clienteCoords, restaurantesCarregados]);

  const listaFinal = restaurantesCompletos.length > 0 ? restaurantesCompletos : restaurantes;
  return (
    <div className="mt-[5rem]">
      <h1 className="text-blue mb-8 mt-2 text-center font-medium">
        Pedir seu delivery no TechOps é rápido e prático!
      </h1>


      <form className="mx-auto mb-8 max-w-md">
        <Input
          type="text"
          placeholder="Buscar por restaurante ou item..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              navigate("/buscar?query=" + encodeURIComponent(e.currentTarget.value));
            }
          }}
          className="!bg-white border border-blue w-full rounded-md px-4 py-2 shadow-sm"
        />
      </form>

      <div className="my-20">

        <h2 className="text-blue mb-5 text-2xl font-semibold">
          Conheça as categorias
        </h2>
        <Categorias onCategoryClick={handleCategoryClick} />
      </div>

      <h2 className="text-blue mb-4 text-2xl font-semibold">
        Conheça os restaurantes disponíveis
      </h2>

      <div className="mt-6 w-full">
        {/* botão de filtro de distância */}
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {mensagemErro ? (
          <p className="text-red-500 col-span-full">{mensagemErro}</p>
        ) : selectedCategory.toLowerCase() === "todos" ? (
          listaFinal.map((itens) => (
            <CardRestauranteMemo key={itens.id} restaurante={itens} />
          ))
        ) : (
          restaurantesFiltrados.map((rest) => (
            <CardRestauranteMemo key={rest.id} restaurante={rest} />
          ))
        )}
      </div>

    </div>
  );
}
