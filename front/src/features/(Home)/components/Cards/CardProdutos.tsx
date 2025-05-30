import { Minus, Plus } from "lucide-react";
import Button from "../../../../shared/components/ui/Button";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useCardProdutos } from "@/features/(Home)/hooks/useCardProduto";
import { CardProdutosProps } from "@/shared/interfaces/IProduto";
import { ImagemDeEntidade } from "@/shared/components/ui/ImagemEntidade";
import { showWarning } from "@/shared/components/ui/AlertasPersonalizados/toastAlerta";

export default function CardProdutos(produto: CardProdutosProps) {
  const num = +produto.valor_unitario;
  const { quantidade, incrementar, decrementar, adicionarAoCarrinho } =
    useCardProdutos(produto, produto.dadosRestaurante);
  const estoqueZerado = produto.qtd_estoque === 0;

  const DISTANCIA_MAXIMA_KM = 13;
  const distancia = produto.dadosRestaurante?.distancia;
  const foraDaArea =
    distancia !== undefined && distancia! > DISTANCIA_MAXIMA_KM;

  const handleAdicionar = () => {
    if (foraDaArea) {
      showWarning("Este restaurante está fora da área de entrega (13 km).");
      return;
    }

    adicionarAoCarrinho();
  };

  return (
    <div
      className={`border-gray-medium bg-gray-light m-auto max-w-full rounded-md border p-4 transition-all duration-300 ${
        estoqueZerado ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <div className="flex gap-4">
        <ImagemDeEntidade src={produto.image_url} alt={produto.nome} />
        <h3 className="font-bold">{produto.nome}</h3>
      </div>

      <div className="w-full">
        <p className="mt-2 font-light">{produto.descricao}</p>

        <div className="my-3 flex w-full items-center justify-between gap-4">
          <p className="text-[1.2rem] font-semibold">
            R$ {produto.valor_unitario}
          </p>
          <p className="text-[1rem] font-semibold">
            <span className="mr-1 font-light">disponíveis:</span>{" "}
            {produto.qtd_estoque}
          </p>
        </div>

        <div className="flex w-full flex-row items-center justify-end gap-4">
          <div className="border-gray-medium flex items-center justify-between gap-6 rounded-lg border bg-white p-2">
            <Button
              color="plain"
              onClick={decrementar}
              className="p-1"
              disabled={estoqueZerado || quantidade === 0}
            >
              <Minus size={20} className="stroke-2" />
            </Button>
            <span className="text-lg font-bold">{quantidade}</span>
            <Button
              color="plain"
              onClick={incrementar}
              className="p-1"
              disabled={estoqueZerado || quantidade >= produto.qtd_estoque}
            >
              <Plus size={20} className="stroke-2" />
            </Button>
          </div>

          <Button
            className="flex w-full items-center justify-between gap-6 p-3 max-[700px]:mt-5"
            disabled={quantidade === 0}
            onClick={handleAdicionar}
          >
            <div className="flex items-center gap-2">
              <AiOutlineShoppingCart className="text-2x1" />
            </div>
            <span className="text-sm whitespace-nowrap md:text-base">
              R${" "}
              {quantidade > 0 ? (num * quantidade).toFixed(2) : num.toFixed(2)}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
