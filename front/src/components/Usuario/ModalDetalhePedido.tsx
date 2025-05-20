import { IMeusPedidos } from "@/interface/IMeusPedidos";
import { api } from "@/connection/axios"; // ajuste o caminho se necessário
import Button from "../ui/Button";

interface ModalDetalhePedidoProps {
  pedido: IMeusPedidos;
  onClose: () => void;
}

export default function ModalDetalhePedido({
  pedido,
  onClose,
}: ModalDetalhePedidoProps) {
  const contem = (texto: string) =>
    pedido.itens.some((item) =>
      item.produto.toLowerCase().includes(texto.toLowerCase()),
    );

  const imagensProdutos: string[] = [];

  if (contem("feijão tropeiro")) imagensProdutos.push("img/feijaoTropeiro.jpg");
  if (contem("feijoada")) imagensProdutos.push("img/feijoada.webp");
  if (contem("picanha")) imagensProdutos.push("img/picanha.jpg");

  if (imagensProdutos.length === 0) {
    if (pedido.restaurante.nome.toLowerCase().includes("sushi")) {
      imagensProdutos.push("img/temaki.jpg");
    } else {
      imagensProdutos.push("img/americanBurguer.jpg");
    }
  }

  const gerarNotaFiscal = async () => {
    try {
      const response = await api.post("/nota-fiscal", {
        id_pedido: pedido.id,
      });

      alert("Nota fiscal gerada com sucesso!");
      console.log(response.data);
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.data?.error_message) {
        alert(`Erro: ${error.response.data.error_message}`);
      } else {
        alert("Falha ao gerar nota fiscal.");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-300 bg-white p-6 shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <div className="mb-6 flex items-center gap-4">
          <img
            src={pedido.restaurante.logo || "img/SushiRest.webp"}
            alt="Logo restaurante"
            className="h-10 w-10 rounded-full border object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-800 uppercase">
              Pedido Nº {pedido.id}
            </h2>
            <p className="text-sm text-gray-600">{pedido.restaurante.nome}</p>
          </div>
        </div>

        <div className="space-y-2 text-[15px] leading-snug text-gray-700">
          <p>
            <span className="font-semibold">Status:</span> {pedido.status}
          </p>
          <p>
            <span className="font-semibold">Endereço:</span>{" "}
            {pedido.endereco.logradouro}, {pedido.endereco.numero}
          </p>
          <p>
            <span className="font-semibold">Pagamento:</span>{" "}
            {pedido.forma_pagamento}
          </p>
          <p>
            <span className="font-semibold">Valor do pedido:</span> R${" "}
            {pedido.valor_total}
          </p>
        </div>

        <div className="mt-6 flex gap-4 overflow-x-auto">
          {imagensProdutos.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Imagem do produto ${index + 1}`}
              className="h-30 w-60 flex-shrink-0 rounded-lg border object-cover"
            />
          ))}
        </div>

        <div className="mt-6">
          <h3 className="mb-2 font-semibold text-gray-800">Itens do pedido:</h3>
          <ul className="list-inside list-disc space-y-1 text-[15px] text-gray-700">
            {pedido.itens.map((item, index) => (
              <li key={index}>
                {item.qtd_itens}x {item.produto}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 border-t border-gray-300 pt-6">
          <h3 className="mb-4 font-semibold text-gray-800">
            Resumo de valores
          </h3>
          <div className="space-y-2 text-[15px] leading-snug text-gray-700">
            <p>
              <span className="font-semibold">Subtotal:</span> R${" "}
              {pedido.valor_total}
            </p>
            <p>
              <span className="font-semibold">Desconto:</span> R$ 12,00
            </p>
            <p>
              <span className="font-semibold">Taxa de entrega:</span> Grátis
            </p>
            <p className="font-semibold">
              <span>Total:</span> R$ {pedido.valor_total - 12}
            </p>
          </div>
        </div>

        {/* Botão de gerar nota fiscal */}
        <div className="mt-6 text-center">
          <Button onClick={gerarNotaFiscal} className="p-2">
            Gerar Nota Fiscal
          </Button>
        </div>
      </div>
    </div>
  );
}
