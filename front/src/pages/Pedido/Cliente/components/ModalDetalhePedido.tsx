import { IMeusPedidos } from "@/interface/IMeusPedidos";

interface ModalDetalhePedidoProps {
  pedido: IMeusPedidos;
  onClose: () => void;
}

export default function ModalDetalhePedido({
  pedido,
  onClose,
}: ModalDetalhePedidoProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg border-[2px] border-gray-400 bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h2 className="mb-4 text-xl font-bold text-black">
          Detalhes do Pedido Nº <span className="text-black">{pedido.Id}</span>
        </h2>

        <p className="text-black">
          <strong className="text-black">Restaurante:</strong>{" "}
          {pedido.restaurante ? pedido.restaurante.nome : undefined}
        </p>
        <p className="text-black">
          <strong className="text-black">Status:</strong> {pedido.status}
        </p>
        <p className="text-black">
          <strong className="text-black">Endereço:</strong>{" "}
          {pedido.endereco.logradouro}, {pedido.endereco.numero}
        </p>
        <p className="text-black">
          <strong className="text-black">Pagamento:</strong>{" "}
          {pedido.forma_pagamento}
        </p>
        <p className="text-black">
          <strong className="text-black">Total:</strong> R$ {pedido.valor_total}
        </p>

        <div className="mt-4">
          <h3 className="font-semibold text-black">Itens do pedido:</h3>
          <ul className="list-inside list-disc text-black">
            {pedido.itens
              ? pedido.itens.map((item, index) => (
                  <li key={index}>
                    {item.qtd_itens}x {item.produto}
                  </li>
                ))
              : undefined}
          </ul>
        </div>
      </div>
    </div>
  );
}
