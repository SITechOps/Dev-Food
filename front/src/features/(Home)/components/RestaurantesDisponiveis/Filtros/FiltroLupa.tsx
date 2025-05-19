import React, { useMemo, useState } from "react";
import { useRestauranteProduto } from "@/contexts/VisaoCliente/Restaurante&ProdutoContext";
import { useConfirmacaoEndereco } from "@/contexts/ConfirmacaoEnderecoContext";
import CardProdutos from "../Cards/CardProdutos";
import Input from "@/shared/components/ui/Input";
import IconAction from "@/shared/components/ui/IconAction";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import Button from "@/shared/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import CardRestaurante from "../Cards/CardRestaurante";
import { ImagemDeEntidade } from "@/shared/components/ui/ImagemEntidade";
import { IProduto } from "@/shared/interfaces/IProduto";
import { IRestaurante } from "@/shared/interfaces/IRestaurante";

export default function FiltroLupa() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const { produtosAll, restaurantes } = useRestauranteProduto();
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const searchTermLower = searchTerm.toLowerCase();
  const [abaAtiva, setAbaAtiva] = useState("restaurantes");
  const { restaurantesCompletos } = useConfirmacaoEndereco();

  const restaurantesFiltrados = useMemo(() => {
    const baseRestaurantes =
      isAuthenticated && restaurantesCompletos.length > 0
        ? restaurantesCompletos
        : restaurantes;

    if (!searchTerm.trim()) return baseRestaurantes;

    return baseRestaurantes.filter((restaurante) => {
      return (
        restaurante.nome.toLowerCase().includes(searchTermLower) ||
        restaurante.especialidade.toLowerCase().includes(searchTermLower) ||
        (restaurante.descricao?.toLowerCase().includes(searchTermLower) ??
          false) ||
        (restaurante.endereco?.logradouro
          ?.toLowerCase()
          .includes(searchTermLower) ??
          false) ||
        (restaurante.endereco?.bairro
          ?.toLowerCase()
          .includes(searchTermLower) ??
          false) ||
        (restaurante.endereco?.cidade
          ?.toLowerCase()
          .includes(searchTermLower) ??
          false)
      );
    });
  }, [
    searchTerm,
    restaurantesCompletos,
    restaurantes,
    isAuthenticated,
    searchTermLower,
  ]);

  const produtosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return produtosAll
      .filter((produto) =>
        produto.nome?.toLowerCase().includes(searchTermLower),
      )
      .map((produto) => ({
        ...produto,
        restaurante: restaurantesCompletos.find(
          (r) => r.id === produto.id_restaurante,
        ),
      }));
  }, [searchTerm, produtosAll, restaurantesCompletos, searchTermLower]);

  const produtosAgrupadosPorRestaurante = useMemo(() => {
    if (!isAuthenticated) return {};
    return produtosFiltrados.reduce(
      (acc, produto) => {
        const restId = produto.restaurante!.id;
        if (!acc[restId]) {
          acc[restId] = {
            restaurante: produto.restaurante!,
            produtos: [] as IProduto[],
          };
        }
        acc[restId].produtos.push(produto);
        return acc;
      },
      {} as Record<string, { restaurante: IRestaurante; produtos: IProduto[] }>,
    );
  }, [produtosFiltrados]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="mt-[5rem]">
      <IconAction
        className="hover:bg-brown-light-active mt-[5rem] flex cursor-pointer items-center justify-center gap-3 self-start rounded-md p-2"
        onClick={() => navigate("/")}
      >
        <p className="text-2xl">Voltar</p>
      </IconAction>

      <h3 className="text-blue my-3 text-center font-medium">
        Insira o nome do restaurante ou item desejado
      </h3>

      <form onSubmit={handleSubmit} className="mx-auto mb-8 max-w-md">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar..."
          className="hover:border-blue border-brown-normal w-full cursor-pointer rounded-md border !bg-white px-4 py-2 shadow-sm"
        />
      </form>

      <div className="mt-6 mb-6 flex border-b border-gray-300">
        <button
          className={`px-4 py-2 font-bold ${
            abaAtiva === "restaurantes"
              ? "border-b-brown-normal text-brown-normal border-b-2 font-extrabold"
              : ""
          }`}
          onClick={() => setAbaAtiva("restaurantes")}
        >
          Restaurantes
        </button>
        <button
          className={`px-4 py-2 font-bold ${
            abaAtiva === "itens"
              ? "border-b-brown-normal text-brown-normal border-b-2 font-extrabold"
              : ""
          }`}
          onClick={() => setAbaAtiva("itens")}
        >
          Itens
        </button>
      </div>

      {abaAtiva === "restaurantes" && (
        <>
          {restaurantesFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
              {restaurantesFiltrados.map((restaurante) => (
                <CardRestaurante
                  key={restaurante.id}
                  restaurante={restaurante}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground mt-2 text-center">
              Nenhum resultado encontrado.
            </p>
          )}
        </>
      )}

      {abaAtiva === "itens" && (
        <>
          {!isAuthenticated ? (
            <>
              <p className="text-muted-foreground mt-4 text-center">
                Para consultar os produtos disponíveis, realize o LOGIN.
              </p>
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={() => navigate("/intermediaria")}
                  className="w-80"
                >
                  Realizar Login
                </Button>
              </div>
            </>
          ) : Object.keys(produtosAgrupadosPorRestaurante).length > 0 ? (
            <div className="mt-10 space-y-12">
              {Object.values(produtosAgrupadosPorRestaurante).map(
                ({ restaurante, produtos }) => (
                  <div key={restaurante.id}>
                    {/* Exibe logo e nome do restaurante */}
                    <div className="mb-4 flex items-center gap-4">
                      {restaurante.logo && (
                        <ImagemDeEntidade
                          src={restaurante.logo}
                          alt={`Logo do restaurante ${restaurante.nome}`}
                          className="h-12 w-12 rounded-full border object-cover"
                        />
                      )}
                      <span className="text-blue text-lg font-semibold">
                        {restaurante.nome}
                      </span>
                    </div>

                    {/* Lista de produtos desse restaurante */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                      {produtos.map((produto) => (
                        <CardProdutos
                          key={produto.id}
                          id={produto.id}
                          nome={produto.nome}
                          descricao={produto.descricao}
                          image_url={produto.image_url}
                          valor_unitario={produto.valor_unitario}
                          dadosRestaurante={restaurante}
                        />
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <p className="text-muted-foreground mt-4 text-center">
              Nenhum produto encontrado.
            </p>
          )}
        </>
      )}
    </div>
  );
}
