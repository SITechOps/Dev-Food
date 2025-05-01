import { api } from "@/connection/axios";
import { useEffect, useState } from "react";
import { IMeusPedidos } from "@/interface/IMeusPedidos";
import { useParams } from "react-router-dom";
import { Props } from "@/interface/IMeusPedidos";

export default function HistoricoDePedido({ tipo }: Props) {
  const { id_usuario } = useParams();
  const [pedidos, setPedidos] = useState<IMeusPedidos[]>([]);

  useEffect(() => {
    async function buscarPedidos() {
      if (!id_usuario) return;

      try {
        const { data } = await api.get(`/pedidos/usuario/${id_usuario}`);
        setPedidos(data.pedidos);
        console.log(data);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    }

    buscarPedidos();
  }, [id_usuario]);

  // filtrar os pedidos com base no tipo
  let pedidosRenderizar = [];
  if (tipo === "meuPedido") {
    pedidosRenderizar = pedidos.slice(0, 1);
  } else if (tipo === "historico") {
    pedidosRenderizar = pedidos.slice(1, 3);
  }

  return (
    <div className="max-w-2xl p-4">
      {pedidosRenderizar.map((pedido) => (
        <div
          key={pedido.Id}
          className="mb-3 flex h-[14rem] flex-col justify-between rounded-md bg-white px-[0.75rem] py-[0.75rem] shadow-sm"
          style={{ border: "1px solid #A9A9A9" }}
        >
          {/* Restaurante */}
          <div className="mb-[0.5rem] flex items-center gap-[0.75rem]">
            <img
              src={
                pedido.restaurante.logo || "../../../public/img/SushiRest.webp"
              }
              alt="Logo restaurante"
              className="h-[2rem] w-[2rem] rounded-full border object-cover"
            />
            <div>
              <p className="text-base font-semibold text-black">
                {pedido.restaurante.nome}
              </p>
              <p className="text-sm text-black">
                Pedido {pedido.status.toLowerCase()} • Nº {pedido.Id}
              </p>
            </div>
          </div>

          {/* Itens */}
          <div className="mb-[0.5rem] ml-[1.25rem] border-l-2 border-gray-200 pl-[0.75rem] text-sm text-black">
            {pedido.itens.slice(0, 2).map((item, index) => (
              <p key={index}>
                {item.qtd_itens} {item.produto}
              </p>
            ))}
            {pedido.itens.length > 2 && (
              <p className="text-gray-500">+{pedido.itens.length - 2} itens</p>
            )}
          </div>

          {/* Endereço */}
          <p className="mb-[0.25rem] truncate text-sm text-black">
            <strong className="text-black">Endereço:</strong>{" "}
            {pedido.endereco.logradouro}, {pedido.endereco.numero}
          </p>

          {/* Pagamento */}
          <p className="text-sm text-black">
            <strong className="text-black">Pagamento:</strong>{" "}
            {pedido.forma_pagamento} • <strong>Total:</strong> R${" "}
            {pedido.valor_total}
          </p>

          {/* Botões */}
          <div className="mt-[0.5rem] flex justify-center gap-30">
            <button className="text-xl font-semibold text-[#EE4C58] hover:underline">
              Ajuda
            </button>
            {tipo === "meuPedido" ? (
              <button className="h-[2.5rem] w-[12rem] cursor-pointer rounded-3xl border bg-[#EE4C58] text-xl font-semibold text-white hover:bg-red-600">
                Acompanhar pedido
              </button>
            ) : (
              <button className="h-[2.5rem] w-[12rem] cursor-pointer text-xl font-semibold text-[#EE4C58]">
                Adicionar à sacola
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
