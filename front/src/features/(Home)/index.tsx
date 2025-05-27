import { useEffect, useState } from "react";
import Input from "@/shared/components/ui/Input";
import React from "react";
import { useRestauranteProduto } from "@/shared/contexts/Restaurante&ProdutoContext";
import { useConfirmacaoEndereco } from "@/shared/contexts/ConfirmacaoEnderecoContext";
import { useNavigate } from "react-router-dom";
import { IRestaurante } from "@/shared/interfaces/IRestaurante";
import Categorias from "./components/Filtros/FiltroCategorias";
import CardRestaurante from "./components/Cards/CardRestaurante";
import { showWarning } from "@/shared/components/ui/AlertasPersonalizados/toastAlerta";
import FiltroDistanciaModal from "./components/Filtros/FiltroPorDistancia";
import ButtonDistance from "./components/Filtros/ButtonDistance";

export default function Home() {
  const navigate = useNavigate();
  const { restaurantes } = useRestauranteProduto();
  const CardRestauranteMemo = React.memo(CardRestaurante);
  const [mensagemErro, setMensagemErro] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [restaurantesFiltrados, setRestaurantesFiltrados] = useState<
    IRestaurante[]
  >([]);
  const { processarRestaurantes, clienteCoords, restaurantesCompletos } =
    useConfirmacaoEndereco();

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
      restaurante.especialidade?.toLowerCase().includes(categoriaSelecionada),
    );

    if (filtrados.length > 0) {
      setRestaurantesFiltrados(filtrados);
      setMensagemErro("");
    } else {
      setRestaurantesFiltrados([]);
      showWarning("Nenhum restaurante encontrado com a categoria");
      setMensagemErro(
        `Nenhum restaurante encontrado com a categoria "${category}"`,
      );
    }
  };

  useEffect(() => {
    if (clienteCoords && restaurantes.length > 0) {
      processarRestaurantes(clienteCoords, restaurantes);
    }
  }, [clienteCoords, restaurantes]);

  const listaFinal =
    restaurantesCompletos.length > 0 ? restaurantesCompletos : restaurantes;

  const [filtroDistanciaAtivo, setFiltroDistanciaAtivo] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [distanciaSelecionada, setDistanciaSelecionada] = useState(10);
  return (
    <div className="my-[5rem]">
      <FiltroDistanciaModal
        aberto={modalAberto}
        onClose={() => setModalAberto(false)}
        distancia={distanciaSelecionada}
        onChange={(valor: number) => setDistanciaSelecionada(valor)}
        onAplicar={() => {
          const baseRestaurantes =
            restaurantesCompletos.length > 0
              ? restaurantesCompletos
              : restaurantes;

          const filtrados = baseRestaurantes.filter(
            (restaurante) =>
              restaurante.distancia !== undefined &&
              parseFloat(
                String(restaurante.distancia).replace("km", "").trim(),
              ) <= distanciaSelecionada,
          );

          if (filtrados.length > 0) {
            setRestaurantesFiltrados(filtrados);
            setMensagemErro("");
            setFiltroDistanciaAtivo(true);
          } else {
            setRestaurantesFiltrados([]);
            showWarning(
              "Nenhum restaurante encontrado na distância selecionada",
            );
            setMensagemErro(
              `Nenhum restaurante encontrado dentro de ${distanciaSelecionada} km.`,
            );
            setFiltroDistanciaAtivo(false);
          }

          setModalAberto(false);
        }}
      />

      <h1 className="text-blue mt-2 mb-8 text-center font-medium">
        Pedir seu delivery no TechOps é rápido e prático!
      </h1>

      <form className="mx-auto mb-8 max-w-md">
        <Input
          type="text"
          placeholder="Buscar por restaurante ou item..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              navigate(
                "/buscar?query=" + encodeURIComponent(e.currentTarget.value),
              );
            }
          }}
          className="hover:border-blue border-brown-light-active w-full cursor-pointer rounded-md border !bg-white px-4 py-2 shadow-sm"
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
        <div className="mb-10">
          <ButtonDistance
            filtroAtivo={filtroDistanciaAtivo}
            distanciaSelecionada={distanciaSelecionada}
            onAbrirModal={() => setModalAberto(true)}
            onLimparFiltro={() => {
              setRestaurantesFiltrados(listaFinal);
              setFiltroDistanciaAtivo(false);
              setMensagemErro("");
            }}
            categoriaSelecionada={selectedCategory}
            filtradosCount={restaurantesFiltrados.length}
            totalRestaurantes={listaFinal.length}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {mensagemErro ? (
          <p className="text-brown-normal col-span-full">{mensagemErro}</p>
        ) : restaurantesFiltrados.length > 0 ? (
          restaurantesFiltrados.map((rest) => (
            <CardRestauranteMemo key={rest.id} restaurante={rest} />
          ))
        ) : (
          listaFinal.map((rest) => (
            <CardRestauranteMemo key={rest.id} restaurante={rest} />
          ))
        )}
      </div>
    </div>
  );
}
