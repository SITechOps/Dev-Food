import { api } from "@/connection/axios";
import { useEffect, useState } from "react";
import { IMeusPedidos } from "@/interface/IMeusPedidos";
import { useParams } from "react-router-dom";

export default function HistoricoDePedido() {
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

  return (
    <div className="max-w-2xl p-4">
      {pedidos.map((pedido) => (
        <div
          key={pedido.Id}
          className="mb-3 flex min-h-[11.25rem] flex-col justify-between rounded-md bg-white px-[0.75rem] py-[0.75rem] shadow-sm"
          style={{ border: "1px solid #A9A9A9" }}
        >
          <div>
            {/* Restaurante */}
            <div className="mb-[0.5rem] flex items-center gap-[0.75rem]">
              <img
                src={pedido.restaurante.logo || "/logo-placeholder.png"}
                alt="Logo restaurante"
                className="h-[2rem] w-[2rem] rounded-full border object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {pedido.restaurante.nome}
                </p>
                <p className="text-xs text-gray-500">
                  Pedido {pedido.status.toLowerCase()} • Nº {pedido.Id}
                </p>
              </div>
            </div>

            {/* Itens */}
            <div className="mb-[0.5rem] ml-[1.25rem] border-l-2 border-gray-200 pl-[0.75rem] text-xs text-gray-500">
              {pedido.itens.slice(0, 2).map((item, index) => (
                <p key={index}>
                  {item.qtd_itens} {item.produto}
                </p>
              ))}
              {pedido.itens.length > 2 && (
                <p className="text-gray-400">
                  +{pedido.itens.length - 2} itens
                </p>
              )}
            </div>

            {/* Endereço */}
            <p className="mb-[0.25rem] truncate text-xs text-gray-600">
              <strong className="text-gray-800">Endereço:</strong>{" "}
              {pedido.endereco.logradouro}, {pedido.endereco.numero}
            </p>

            {/* Pagamento */}
            <p className="text-xs text-gray-600">
              <strong className="text-gray-800">Pagamento:</strong>{" "}
              {pedido.forma_pagamento} • <strong>Total:</strong> R${" "}
              {pedido.valor_total}
            </p>
          </div>

          {/* Botões */}
          <div className="mt-[0.5rem] flex justify-between">
            <button className="text-xs font-semibold text-red-500 hover:underline">
              Ajuda
            </button>
            <button className="rounded-full border border-red-600 bg-red-500 px-[0.75rem] py-[0.375rem] text-xs font-semibold text-white hover:bg-red-600">
              Acompanhar pedido
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
