import { useState } from "react";
import { IMeusPedidos } from "@/features/(Usuario)/interface/IMeusPedidos";
import Button from "@/shared/components/ui/Button";
import Modal from "@/shared/components/ui/Modal";
import { api } from "@/lib/axios";

interface ModalDetalhePedidoProps {
  pedido: IMeusPedidos;
  onClose: () => void;
}

export default function ModalDetalhePedido({
  pedido,
  onClose,
}: ModalDetalhePedidoProps) {
  const [isModalNotaOpen, setIsModalNotaOpen] = useState(false);
  const [notaStatus, setNotaStatus] = useState<"sucesso" | "erro" | null>(null);
  const [mensagem, setMensagem] = useState("");

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

      setNotaStatus("sucesso");
      setMensagem("Nota fiscal gerada com sucesso!");
    } catch (error: any) {
      console.error(error);
      setNotaStatus("erro");
      if (error.response && error.response.data?.error_message) {
        setMensagem(`Erro: ${error.response.data.error_message}`);
      } else {
        setMensagem("Falha ao gerar nota fiscal.");
      }
    } finally {
      setIsModalNotaOpen(true);
    }
  };

  return (
    <>
      {/* Modal principal de detalhes do pedido */}
      <Modal isOpen={true} onClose={onClose} className="max-w-md">
        <div className="flex flex-col gap-4">
          <p>
            <strong>Restaurante:</strong> {pedido.restaurante.nome}
          </p>
          <p>
            <strong>Status:</strong> {pedido.status}
          </p>
          <p>
            <strong>Endereço:</strong> {pedido.endereco.logradouro},{" "}
            {pedido.endereco.numero}
          </p>
          <p>
            <strong>Pagamento:</strong> {pedido.forma_pagamento}
          </p>
          <p>
            <strong>Total:</strong> R$ {pedido.valor_total}
          </p>

          <div>
            <h3 className="font-semibold">Itens do pedido:</h3>
            <ul className="list-inside list-disc">
              {pedido.itens.map((item, index) => (
                <li key={index}>
                  {item.qtd_itens}x {item.produto}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <h3 className="mb-2 font-semibold">Resumo de valores</h3>
            <p>Subtotal: R$ {pedido.valor_total}</p>
            <p>Desconto: R$ 12,00</p>
            <p>Taxa de entrega: Grátis</p>
            <p className="font-semibold">Total: R$ {pedido.valor_total - 12}</p>
          </div>

          <Button onClick={gerarNotaFiscal}>Gerar Nota Fiscal</Button>
        </div>
      </Modal>

      {/* Modal de retorno da nota fiscal */}
      <Modal
        isOpen={isModalNotaOpen}
        onClose={() => setIsModalNotaOpen(false)}
        className="max-w-sm"
      >
        <div className="flex flex-col items-center gap-4">
          <h2
            className={`text-lg font-semibold ${
              notaStatus === "sucesso" ? "text-green-600" : "text-red-600"
            }`}
          >
            {notaStatus === "sucesso" ? "Sucesso!" : "Erro"}
          </h2>
          <p className="text-center">{mensagem}</p>
          <Button onClick={() => setIsModalNotaOpen(false)}>Fechar</Button>
        </div>
      </Modal>
    </>
  );
}
