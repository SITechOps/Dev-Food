import { ImagemDeEntidade } from "../ui/ImagemEntidade";
import { IProduto } from "@/interface/IProduto";
interface ProdutoCardProps {
  produto: IProduto;
}

const ProdutoCard = ({ produto }: ProdutoCardProps) => {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-md">
      <ImagemDeEntidade
        src={produto.image_url}
        alt={produto.nome}
        className="h-32 w-full rounded object-cover"
      />
      <h3 className="mt-2 font-semibold">{produto.nome}</h3>
      <p className="text-sm text-gray-600">{produto.descricao}</p>
      <p className="mt-1 text-sm font-medium">
        R$ {Number(produto.valor_unitario).toFixed(2)}
      </p>
    </div>
  );
};
export default ProdutoCard;
