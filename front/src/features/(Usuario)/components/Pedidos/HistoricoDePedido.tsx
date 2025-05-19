import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { IMeusPedidos } from "@/features/(Usuario)/interface/IMeusPedidos";
import { Props } from "@/features/(Usuario)/interface/IMeusPedidos";

import { useAuth } from "@/shared/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../../../shared/components/ui/Button";
import ModalDetalhePedido from "./ModalDetalhePedido";
import { ImagemDeEntidade } from "@/shared/components/ui/ImagemEntidade";

export default function HistoricoDePedido({ tipo }: Props) {
  const { userData } = useAuth();
  const id_usuario = userData?.sub;
  const [pedidos, setPedidos] = useState<IMeusPedidos[]>([]);
  const [pedidoSelecionado, setPedidoSelecionado] =
    useState<IMeusPedidos | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function buscarPedidos() {
      if (!id_usuario) return;

      try {
        const { data } = await api.get(`/pedidos/usuario/${id_usuario}`);
        setPedidos(data.pedidos);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    }

    buscarPedidos();
  }, [id_usuario]);

  // Filtrar os pedidos com base no tipo
  let pedidosRenderizar: IMeusPedidos[] = [];

  if (tipo === "meuPedido") {
    pedidosRenderizar = pedidos.filter(
      (pedido) => pedido.status?.toLowerCase() !== "entregue",
    );
  } else if (tipo === "historico") {
    pedidosRenderizar = pedidos.filter(
      (pedido) => pedido.status?.toLowerCase() === "entregue",
    );
  }

  return (
    <div className="max-w-2xl p-4">
      {pedidosRenderizar.length === 0 ? (
        <p className="text-gray-medium my-2">Nenhum pedido até o momento.</p>
      ) : (
        pedidosRenderizar.map((pedido) => (
          <div
            key={pedido.Id}
            className="mb-3 flex flex-col justify-between rounded-md bg-white p-5 shadow-sm"
            style={{ border: "1px solid #A9A9A9" }}
          >
            <div className="mb-[0.5rem] flex items-center gap-[0.75rem]">
              <ImagemDeEntidade
                src={pedido.restaurante!.logo}
                alt={pedido.restaurante!.nome}
                className="mb-4 h-[2rem] w-[2rem] rounded-full border object-cover"
              />
              <div>
                <p className="text-base font-semibold text-black">
                  {pedido.restaurante!.nome}
                </p>
                <p className="text-sm text-black">
                  Pedido {pedido.status!.toLowerCase()} • Nº {pedido.Id}
                </p>
              </div>
            </div>

            <div className="mb-[0.5rem] ml-[1.25rem] border-l-2 border-gray-200 pl-[0.75rem] text-sm text-black">
              {pedido.itens!.slice(0, 2).map((item, index) => (
                <p key={index}>
                  {item.qtd_itens} {item.produto}
                </p>
              ))}
              {pedido.itens!.length > 2 && (
                <p className="text-gray-500">
                  +{pedido.itens!.length - 2} itens
                </p>
              )}
            </div>

            <p className="mb-[0.25rem] truncate text-sm text-black">
              <strong className="text-black">Endereço:</strong>{" "}
              {pedido.endereco.logradouro}, {pedido.endereco.numero}
            </p>

            <p className="text-sm text-black">
              <strong className="text-black">Pagamento:</strong>{" "}
              {pedido.forma_pagamento} • <strong>Total:</strong> R${" "}
              {pedido.valor_total}
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
                  <Button color="secondary" className="p-2">
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

      {/* Modal */}
      {pedidoSelecionado && (
        <ModalDetalhePedido
          pedido={pedidoSelecionado}
          onClose={() => setPedidoSelecionado(null)}
        />
      )}
    </div>
  );
}
