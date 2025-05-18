import { Minus, Plus } from "lucide-react";
import Button from "../../../../../components/ui/Button";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useCardProdutos } from "@/hooks/Restaurante/VisaoCliente/useCardProduto";
import { CardProdutosProps } from "@/interface/IProduto";
import { ImagemDeEntidade } from "@/components/ui/ImagemEntidade";

export default function CardProdutos(props: CardProdutosProps) {
  const { nome, descricao, image_url, valor_unitario, dadosRestaurante } =
    props;
  const num = +valor_unitario;
  const { quantidade, incrementar, decrementar, adicionarAoCarrinho } =
    useCardProdutos(props, dadosRestaurante);

  return (
    <div className="border-gray-medium bg-gray-light m-auto max-w-full cursor-pointer rounded-md border p-4 transition-all duration-300">
      <div className="flex gap-4">
        <ImagemDeEntidade src={image_url} alt={nome} />

        <h3 className="font-bold">{nome}</h3>
      </div>
      <div className="w-full">
        <p className="mt-2 font-light">{descricao}</p>
        <p className="mt-3 mb-3 text-[1.2rem] font-semibold">
          R$ {valor_unitario}
        </p>

        <div className="flex w-full flex-row items-center justify-end gap-4">
          <div className="border-gray-medium flex items-center justify-between gap-6 rounded-lg border bg-white p-2">
            <Button color="plain" onClick={decrementar} className="p-1">
              <Minus size={20} className="stroke-2" />
            </Button>
            <span className="text-lg font-bold">{quantidade}</span>
            <Button color="plain" onClick={incrementar} className="p-1">
              <Plus size={20} className="stroke-2" />
            </Button>
          </div>
          <Button
            className="flex w-full items-center justify-between gap-6 p-3 max-[700px]:mt-5"
            disabled={quantidade === 0}
            onClick={adicionarAoCarrinho}
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
