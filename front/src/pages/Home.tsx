import { useEffect, useState, useMemo, useRef } from "react";
import { api } from "../connection/axios";
import RestauranteCard from "../components/Restaurante/RestaurantCard";
import ProdutoCard from "../components/Produto/ProdutoCard";
import MiniRestauranteCard from "../components/Restaurante/MiniCard";
import { Link } from "react-router-dom";

import { geocodeTexto } from "../utils/useGeocode";
import { calcularDistancia } from "../utils/useDistanceMatrix";
import { calcularTaxaEntrega } from "../utils/calculateDeliveryFee";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const [restaurantes, setRestaurantes] = useState<any[]>([]);
  const [abaAtiva, setAbaAtiva] = useState("restaurantes");
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState([]);
  const { userData, token } = useAuth();
  const idUsuario = userData?.sub;
  const [clienteCoords, setClienteCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const processamentoFeitoRef = useRef(false);

  // Obter endereço do cliente
  useEffect(() => {
    async function obterEnderecoCliente() {
      try {
        if (!idUsuario || !token) {
          console.error("❌ ID do usuário ou token não encontrado.");
          return;
        }

        const response = await api.get(`/user/${idUsuario}/enderecos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const endereco = response.data?.data?.attributes[0];
        console.log("📦 Endereço recebido:", endereco);

        if (!endereco) {
          console.error("❌ Endereço vazio ou inválido.");
          return;
        }

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
  }, [idUsuario, token]);

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
      if (!clienteCoords || restaurantes.length === 0 || processamentoFeitoRef.current) {
        console.log("⏳ Aguardando coordenadas do cliente e restaurantes ou processamento já feito...");
        return;
      }
  
      console.log("🚀 Processando distância/taxa para restaurantes...");
  
      const atualizados = await Promise.all(
        restaurantes.map(async (rest) => {
          const enderecoCompletoRestaurante = `${rest.endereco.logradouro}, ${rest.endereco.numero}, ${rest.endereco.bairro}, ${rest.endereco.cidade}, ${rest.endereco.estado}, ${rest.endereco.pais}`;
  
          console.log(
            `📌 Geocodificando endereço do restaurante ${rest.nome}:`,
            enderecoCompletoRestaurante,
          );
  
          const destino = await geocodeTexto(enderecoCompletoRestaurante);
          if (!destino) {
            console.warn(
              "⚠️ Falha ao geocodificar endereço do restaurante:",
              enderecoCompletoRestaurante,
            );
            return rest;
          }
  
          try {
            const distanciaInfo = await calcularDistancia(clienteCoords, destino);
            console.log(`📏 Distância até ${rest.nome}:`, distanciaInfo.distance);
            console.log(`🕒 Duração até ${rest.nome}:`, distanciaInfo.duration);
  
            const taxaEntrega =
              distanciaInfo.distance != null ? calcularTaxaEntrega(distanciaInfo.distance) : null;
            console.log(`💰 Taxa de entrega para ${rest.nome}:`, taxaEntrega);
  
            return {
              ...rest,
              distancia: distanciaInfo.distance?.toFixed(1),
              taxaEntrega,
            };
          } catch (err) {
            console.error(`❌ Erro ao calcular distância para ${rest.nome}:`, err);
            return rest;
          }
        }),
      );
  
      setRestaurantes(atualizados);
      processamentoFeitoRef.current = true; // Marca o processamento como feito
    }
  
    processarRestaurantes();
  }, [restaurantes, clienteCoords]);

  // Filtragem por busca
  const filteredRestaurantes = useMemo(() => {
    return restaurantes.filter((restaurante) => {
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
  }, [restaurantes, produtos, searchTerm]);

  // Agrupamento por categoria
  const grupoCategoria = useMemo(() => {
    return filteredRestaurantes.reduce((acc: any, item: any) => {
      const categoria = item.especialidade || "Outros";
      if (!acc[categoria]) acc[categoria] = [];
      acc[categoria].push(item);
      return acc;
    }, {} as Record<string, typeof restaurantes>);
  }, [filteredRestaurantes]);

  // Produtos filtrados
  const produtosFiltrados = useMemo(() => {
    return produtos
      .filter((produto) =>
        produto.nome?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .map((produto) => {
        const restaurante = restaurantes.find(
          (r) => r.id === produto.id_restaurante,
        );
        return { ...produto, restaurante };
      });
  }, [produtos, restaurantes, searchTerm]);

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
          className={`px-4 py-2 font-bold ${
            abaAtiva === "restaurantes"
              ? "border-b-brown-normal text-brown-normal font-extrabold border-b-2 "
              : ""
          }`}
          onClick={() => setAbaAtiva("restaurantes")}
        >
          Restaurantes
        </button>
        <button
          className={`px-4 py-2 font-bold ${
            abaAtiva === "itens"
              ? "border-b-brown-normal border-b-2  text-brown-normal font-extrabold"
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