// pages/teste/ver-pedidos.tsx
import { api } from "@/connection/axios";
import { useEffect, useState } from "react";
import { IMeusPedidos } from "@/interface/IMeusPedidos";

export default function VerPedidos() {
  const [pedidos, setPedidos] = useState<IMeusPedidos[]>([]);

  useEffect(() => {
    async function buscarPedidos() {
      try {
        const { data } = await api.get("/pedidos");
        setPedidos(data);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    }

    buscarPedidos();
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-6">
      {pedidos.map((pedido) => (
        <div
          key={pedido.id}
          className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-md"
        >
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <strong className="text-gray-800">Usuário:</strong>{" "}
              {pedido.id_usuario}
            </p>
            <p className="text-sm text-gray-600">
              <strong className="text-gray-800">Valor Total:</strong> R${" "}
              {pedido.valor_total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              <strong className="text-gray-800">Forma de Pagamento:</strong>{" "}
              {pedido.forma_pagamento}
            </p>
          </div>

          <div className="mb-4 flex items-center gap-4">
            <img
              src={pedido.restaurante_logo}
              alt="Logo restaurante"
              className="h-16 w-16 rounded object-contain"
            />
            <p className="text-lg font-semibold">{pedido.restaurante_nome}</p>
          </div>

          <p className="mb-4 text-sm text-gray-700">
            <strong>Endereço:</strong>{" "}
            {`${pedido.endereco_logradouro}, ${pedido.endereco_numero} - ${pedido.endereco_bairro}, ${pedido.endereco_cidade} - ${pedido.endereco_estado} (${pedido.endereco_complemento})`}
          </p>

          <div className="text-sm text-gray-700">
            <p>
              <strong>Item 1:</strong> {pedido.item1_produto} -{" "}
              {pedido.item1_qtd}x (R$ {pedido.item1_valor.toFixed(2)})
            </p>
            {pedido.item2_produto && (
              <p>
                <strong>Item 2:</strong> {pedido.item2_produto} -{" "}
                {pedido.item2_qtd}x (R$ {pedido.item2_valor?.toFixed(2)})
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
