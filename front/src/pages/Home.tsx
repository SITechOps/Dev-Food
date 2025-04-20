import { useEffect, useState } from "react";
import { api } from "../connection/axios";
import RestauranteCard from "../components/Restaurante/RestaurantCard";
import ProdutoCard from "../components/Produto/ProdutoCard";
import MiniRestauranteCard from "../components/Restaurante/MiniCard";
import { Link } from "react-router-dom";

import { geocodeTexto } from "../utils/useGeocode";
import { calcularDistancia } from "../utils/useDistanceMatrix";
import { calcularTaxaEntrega } from "../utils/calculateDeliveryFee";

export default function Home() {
  const [restaurantes, setRestaurantes] = useState<any[]>([]);
  const [abaAtiva, setAbaAtiva] = useState("restaurantes");
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [clienteCoords, setClienteCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Obter endereço do cliente
  useEffect(() => {
    async function obterEnderecoCliente() {
      try {
        const userId = localStorage.getItem("id");
        console.log("🔍 Buscando endereço do usuário com ID:", userId);

        const response = await api.get(`/user/${userId}/enderecos`);
        const endereco = response.data?.data?.attributes[0] || [];
        console.log("📦 Endereço recebido:", endereco);

        const enderecoCompleto = `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}, ${endereco.pais}`;
        console.log("📍 Endereço completo:", enderecoCompleto);

        const coords = await geocodeTexto(enderecoCompleto);
        console.log("📡 Coordenadas do cliente:", coords);

        if (coords) setClienteCoords(coords);
      } catch (error) {
        console.error(
          "❌ Erro ao buscar/geocodificar endereço do cliente:",
          error,
        );
      }
    }

    obterEnderecoCliente();
  }, []);

  // Buscar restaurantes
  useEffect(() => {
    async function listarRestaurantes() {
      try {
        const response = await api.get("/restaurantes");
        const data = response?.data?.data?.attributes || [];
        console.log("🍽️ Restaurantes recebidos:", data);
        setRestaurantes(data);
      } catch (error) {
        console.error("❌ Erro ao buscar restaurantes:", error);
      }
    }

    listarRestaurantes();
  }, []);

  // Buscar produtos por restaurante
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

        console.log("🧺 Produtos com restaurantes associados:", allProdutos);
        setProdutos(allProdutos);
      } catch (error) {
        console.error("❌ Erro ao buscar produtos por restaurante:", error);
      }
    }

    if (restaurantes.length > 0) {
      listarProdutosPorRestaurante();
    }
  }, [restaurantes]);

  // Processar distância e taxa de entrega
  useEffect(() => {
    async function processarRestaurantes() {
      if (!clienteCoords) {
        console.log("⏳ Aguardando coordenadas do cliente...");
        return;
      }

      console.log("🚀 Processando distância/taxa para restaurantes...");

      const atualizados = await Promise.all(
        restaurantes.map(async (rest) => {
          console.log(
            `📌 Geocodificando endereço do restaurante ${rest.nome}:`,
            rest.endereco,
          );

          const destino = await geocodeTexto(rest.endereco);
          if (!destino) {
            console.warn(
              "⚠️ Falha ao geocodificar endereço do restaurante:",
              rest.endereco,
            );
            return rest;
          }

          const distancia = await calcularDistancia(clienteCoords, destino);
          console.log(`📏 Distância até ${rest.nome}:`, distancia);

          const taxaEntrega =
            distancia != null ? calcularTaxaEntrega(distancia) : null;
          console.log(`💰 Taxa de entrega para ${rest.nome}:`, taxaEntrega);

          return {
            ...rest,
            distancia: distancia?.toFixed(1),
            taxaEntrega,
          };
        }),
      );

      setRestaurantes(atualizados);
    }

    if (restaurantes.length > 0 && clienteCoords) {
      processarRestaurantes();
    }
  }, [restaurantes, clienteCoords]);

  // Filtragem por busca
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

  // Agrupamento por categoria
  const grupoCategoria = filteredRestaurantes.reduce(
    (acc: any, item: any) => {
      const categoria = item.especialidade || "Outros";
      if (!acc[categoria]) acc[categoria] = [];
      acc[categoria].push(item);
      return acc;
    },
    {} as Record<string, typeof restaurantes>,
  );

  // Produtos filtrados
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
            <Link to={`/restaurante/${restaurante.id}`} key={restaurante.id}>
              <RestauranteCard restaurante={restaurante} />
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
