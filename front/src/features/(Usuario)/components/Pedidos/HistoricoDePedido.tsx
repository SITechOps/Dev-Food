import {
  showSuccess,
  showWarning,
} from "@/shared/components/ui/AlertasPersonalizados/toastAlerta";
import { CarrinhoContext } from "@/shared/contexts/CarrinhoContext";
import { IRestaurante } from "@/shared/interfaces/IRestaurante";
import { IProduto } from "@/shared/interfaces/IProduto";
import { useContext, useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { IMeusPedidos, ItemPedido } from "@/features/(Usuario)/interface/IMeusPedidos";
import { Props } from "@/features/(Usuario)/interface/IMeusPedidos";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../../../shared/components/ui/Button";
import ModalDetalhePedido from "./ModalDetalhePedido";
import { ImagemDeEntidade } from "@/shared/components/ui/ImagemEntidade";

interface CartItem extends IProduto {
  quantidade: number;
  subtotal: number;
  restaurante: IRestaurante; // Espera-se que este seja o objeto IRestaurante completo
}

export default function HistoricoDePedido({ tipo }: Props) {
  const { userData } = useAuth();
  const id_usuario = userData?.sub;
  const [pedidos, setPedidos] = useState<IMeusPedidos[]>([]);
  const [pedidoSelecionado, setPedidoSelecionado] =
    useState<IMeusPedidos | null>(null);
  const navigate = useNavigate();
  const { atualizarQuantidadeTotal } = useContext(CarrinhoContext);

  // Estado para armazenar todos os restaurantes e o status do carregamento
  const [todosOsRestaurantes, setTodosOsRestaurantes] = useState<IRestaurante[]>([]);
  const [carregandoRestaurantes, setCarregandoRestaurantes] = useState<boolean>(true);

  // Carregar todos os restaurantes na montagem do componente
  useEffect(() => {
    async function fetchTodosRestaurantes() {
      try {
        setCarregandoRestaurantes(true);
        const { data } = await api.get('/restaurantes'); // Sua rota GET /restaurantes
        // Supondo que a resposta seja { data: IRestaurante[] } ou similar
        setTodosOsRestaurantes(data.data || []);
      } catch (error) {
        console.error("Erro ao buscar a lista de todos os restaurantes:", error);
        showWarning("Não foi possível carregar dados auxiliares dos restaurantes.");
        setTodosOsRestaurantes([]); // Define como array vazio em caso de erro para evitar loops
      } finally {
        setCarregandoRestaurantes(false);
      }
    }
    fetchTodosRestaurantes();
  }, []); // Array de dependências vazio para executar apenas uma vez

  useEffect(() => {
    async function buscarPedidos() {
      if (!id_usuario) return;
      try {
        const { data } = await api.get(`/pedidos/usuario/${id_usuario}`);
        setPedidos(data.pedidos || []);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        showWarning("Falha ao buscar histórico de pedidos.");
      }
    }
    buscarPedidos();
  }, [id_usuario]);

  let pedidosRenderizar: IMeusPedidos[] = [];
  if (pedidos && pedidos.length > 0) {
    if (tipo === "meuPedido") {
      pedidosRenderizar = pedidos.filter(
        (pedido) => pedido.status?.toLowerCase() !== "entregue",
      );
    } else if (tipo === "historico") {
      pedidosRenderizar = pedidos.filter(
        (pedido) => pedido.status?.toLowerCase() === "entregue",
      );
    }
  }

  const adicionarPedidoHistoricoAoCarrinho = (pedidoParaReplicar: IMeusPedidos) => {
    if (carregandoRestaurantes) {
      showWarning("Aguarde, carregando dados dos restaurantes...");
      return;
    }

    if (!pedidoParaReplicar.itens || pedidoParaReplicar.itens.length === 0) {
      showWarning("Este pedido não contém itens para adicionar.");
      return;
    }

    const storedCarrinho = localStorage.getItem("carrinho");
    const carrinho: CartItem[] = storedCarrinho ? JSON.parse(storedCarrinho) : [];
    
    let restauranteDoPedidoProcessado = { ...pedidoParaReplicar.restaurante };

    // Se o restaurante do pedido não tiver ID, mas tiver CNPJ, tenta encontrar na lista completa
    if (restauranteDoPedidoProcessado && !restauranteDoPedidoProcessado.id && restauranteDoPedidoProcessado.cnpj && todosOsRestaurantes.length > 0) {
      const restauranteEncontradoNaLista = todosOsRestaurantes.find(
        (r) => r.cnpj === restauranteDoPedidoProcessado.cnpj
      );
      if (restauranteEncontradoNaLista) {
        console.log(`ID e dados completos encontrados para o restaurante CNPJ ${restauranteDoPedidoProcessado.cnpj} na lista de restaurantes.`);
        restauranteDoPedidoProcessado = restauranteEncontradoNaLista; // Usa o objeto completo da lista
      } else {
        console.warn(`Restaurante com CNPJ ${restauranteDoPedidoProcessado.cnpj} não encontrado na lista completa. O ID do restaurante continuará ausente.`);
      }
    }


    if (!restauranteDoPedidoProcessado || !restauranteDoPedidoProcessado.cnpj || !restauranteDoPedidoProcessado.nome) {
      showWarning("Restaurante com dados essenciais (CNPJ ou Nome) incompletos para este pedido.");
      console.error("DEBUG: restauranteDoPedidoProcessado faltando CNPJ ou Nome:", restauranteDoPedidoProcessado);
      return;
    }
    if (!restauranteDoPedidoProcessado.id) {
        console.warn("DEBUG: Mesmo após a tentativa de busca, o ID do restaurante deste pedido histórico não foi encontrado.", restauranteDoPedidoProcessado);
    }


    if (carrinho.length > 0) {
      if (carrinho[0] && carrinho[0].restaurante && carrinho[0].restaurante.cnpj) {
        const cnpjNoCarrinho = carrinho[0].restaurante.cnpj;
        if (cnpjNoCarrinho !== restauranteDoPedidoProcessado.cnpj) {
          showWarning(
            "Opa! Já existe um pedido de outro restaurante. Finalize ou limpe o carrinho para adicionar novos itens.",
          );
          return;
        }
      } else if (carrinho.length > 0) {
        showWarning("Seu carrinho atual parece ter um item com dados de restaurante inválidos.");
        return;
      }
    }

    let itensAdicionadosCount = 0;
    let itensAtualizadosCount = 0;

    pedidoParaReplicar.itens.forEach((itemDoPedidoHistorico: ItemPedido) => {
      const produtoInput = itemDoPedidoHistorico.produto;
      let nomeProdutoParaMensagem: string = "desconhecido";

      if (typeof produtoInput === 'string' && produtoInput.trim() !== "") {
        nomeProdutoParaMensagem = produtoInput;
      } else if (typeof produtoInput === 'object' && produtoInput !== null && produtoInput.nome) {
        nomeProdutoParaMensagem = produtoInput.nome;
      }

      if (typeof produtoInput !== 'object' || produtoInput === null || 
          typeof produtoInput.id === 'undefined' || typeof produtoInput.nome === 'undefined') {
        console.error(`Item do pedido histórico com dados de produto inválidos. Esperado objeto com id e nome, recebido:`, itemDoPedidoHistorico);
        showWarning(`O item "${nomeProdutoParaMensagem}" do histórico não pôde ser adicionado pois seu ID de produto ou informações detalhadas não foram encontradas.`);
        return; 
      }
      
      const produtoDoHistorico = produtoInput as IProduto;

      const qtdItens = Number(itemDoPedidoHistorico.qtd_itens);
      const valorTotalItem = Number(itemDoPedidoHistorico.valor);

      if (isNaN(qtdItens) || qtdItens <= 0) return;
      if (isNaN(valorTotalItem)) {
        showWarning(`O item "${produtoDoHistorico.nome}" possui valor total inválido.`);
        return;
      }

      const valorUnitarioCalculado = valorTotalItem / qtdItens;
      if (isNaN(valorUnitarioCalculado) || !isFinite(valorUnitarioCalculado)) {
        showWarning(`Não foi possível calcular o preço do item "${produtoDoHistorico.nome}".`);
        return;
      }
      
      const itemParaAdicionar: CartItem = {
        id: String(produtoDoHistorico.id),
        nome: String(produtoDoHistorico.nome),
        descricao: String(produtoDoHistorico.descricao || ""),
        image_url: String(produtoDoHistorico.image_url || (produtoDoHistorico as any).imagem_url || ""),
        valor_unitario: valorUnitarioCalculado,
        id_restaurante: restauranteDoPedidoProcessado.id ? String(restauranteDoPedidoProcessado.id) : undefined,
        quantidade: qtdItens,
        subtotal: valorTotalItem,
        restaurante: restauranteDoPedidoProcessado, // Usa o objeto restaurante enriquecido (ou original se não encontrado)
      };

      const itemIndex = carrinho.findIndex((cartItem: CartItem) => cartItem.id === itemParaAdicionar.id);

      if (itemIndex !== -1) {
        carrinho[itemIndex].quantidade += itemParaAdicionar.quantidade;
        carrinho[itemIndex].subtotal += itemParaAdicionar.subtotal;
        itensAtualizadosCount++;
      } else {
        carrinho.push(itemParaAdicionar);
        itensAdicionadosCount++;
      }
    });

    if (itensAdicionadosCount > 0 || itensAtualizadosCount > 0) {
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      atualizarQuantidadeTotal();
      showSuccess(
        `${itensAdicionadosCount} item(ns) novo(s) adicionado(s) e ${itensAtualizadosCount} item(ns) atualizado(s) no carrinho!`,
      );
    } else if (pedidoParaReplicar.itens.length > 0) {
        showWarning(
          "Nenhum item novo foi adicionado. Verifique se os itens já estão no carrinho, as quantidades eram zero ou os dados dos itens eram inválidos."
        );
    }
  };

  // Restante do JSX (com as melhorias de segurança de acesso a propriedades)
  return (
    <div className="max-w-2xl p-4">
      {/* ... (JSX como na resposta anterior, ele já está mais seguro) ... */}
      {pedidosRenderizar.length === 0 ? (
        <p className="text-gray-medium my-2">Nenhum pedido até o momento.</p>
      ) : (
        pedidosRenderizar.map((pedido) => (
          <div
            key={pedido.Id || pedido.id} 
            className="mb-3 flex flex-col justify-between rounded-md bg-white p-5 shadow-sm"
            style={{ border: "1px solid #A9A9A9" }}
          >
            <div className="mb-[0.5rem] flex items-center gap-[0.75rem]">
              <ImagemDeEntidade
                src={pedido.restaurante?.logo || ""}
                alt={pedido.restaurante?.nome || "Logo Restaurante"}
                className="mb-4 h-[2rem] w-[2rem] rounded-full border object-cover"
              />
              <div>
                <p className="text-base font-semibold text-black">
                  {pedido.restaurante?.nome || "Restaurante não informado"}
                </p>
                <p className="text-sm text-black">
                  Pedido {pedido.status?.toLowerCase() || "status desconhecido"} • Nº {pedido.Id || pedido.id}
                </p>
              </div>
            </div>

            <div className="mb-[0.5rem] ml-[1.25rem] border-l-2 border-gray-200 pl-[0.75rem] text-sm text-black">
              {pedido.itens && pedido.itens.length > 0 ? pedido.itens.slice(0, 2).map((item, index) => (
                <p key={index}>
                  {item.qtd_itens}{" "}
                  {typeof item.produto === 'string' 
                    ? item.produto 
                    : (item.produto && typeof item.produto === 'object' && item.produto.nome 
                        ? item.produto.nome 
                        : "Produto desconhecido")}
                </p>
              )) : <p>Nenhum item para exibir.</p>}
              {pedido.itens && pedido.itens.length > 2 && (
                <p className="text-gray-500">
                  +{pedido.itens.length - 2} itens
                </p>
              )}
            </div>

            <p className="mb-[0.25rem] truncate text-sm text-black">
              <strong className="text-black">Endereço:</strong>{" "}
              {pedido.endereco?.logradouro || "Não informado"}, {pedido.endereco?.numero || ""}
            </p>

            <p className="text-sm text-black">
              <strong className="text-black">Pagamento:</strong>{" "}
              {pedido.forma_pagamento || "Não informado"} • <strong>Total:</strong> R${" "}
              {typeof pedido.valor_total === 'number' ? pedido.valor_total.toFixed(2) : "0.00"}
            </p>

            <div className="mt-[0.5rem] flex justify-center gap-10">
              <Button color="plain" className="p-2">
                Ajuda
              </Button>
              {tipo === "meuPedido" ? (
                <Button
                  className="p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/status-pedido");
                  }}
                >
                  Acompanhar pedido
                </Button>
              ) : (
                <>
                  <Button
                    color="secondary"
                    className="p-2"
                    onClick={() => adicionarPedidoHistoricoAoCarrinho(pedido)}
                  >
                    Adicionar à sacola
                  </Button>
                  <Button
                    className="p-2"
                    onClick={() => setPedidoSelecionado(pedido)}
                  >
                    Detalhe do Pedido
                  </Button>
                </>
              )}
            </div>
          </div>
        ))
      )}

      {pedidoSelecionado && (
        <ModalDetalhePedido
          pedido={pedidoSelecionado}
          onClose={() => setPedidoSelecionado(null)}
        />
      )}
    </div>
  );
}