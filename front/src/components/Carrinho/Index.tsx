import { IoClose } from "react-icons/io5";
import Button from "@/components/ui/Button";
import { Minus, Plus } from "lucide-react";
import { useCarrinho } from "@/hooks/useCarinho";
import TechOpsLogo from "@/assets/techops.png";

interface MenuLeteralCarrinhoProps {
  isCarrinhoOpen: boolean;
  setIsCarrinhoOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Carrinho({
  isCarrinhoOpen,
  setIsCarrinhoOpen,
}: MenuLeteralCarrinhoProps) {
  const {
    dados,
    incrementar,
    decrementar,
    removerItem,
    subtotal,
    total,
    escolherFormaPagamento,
  } = useCarrinho();

  const resSelecionado = localStorage.getItem("restauranteSelecionado");
  const taxaEntregaRestaurante = resSelecionado
    ? JSON.parse(resSelecionado).taxaEntrega
    : 0;

  return (
    <>
      <div className="text-blue fixed inset-0 z-50 flex justify-end bg-black/70">
        <div className="custom-scroll relative h-full w-full max-w-md overflow-y-auto bg-white p-6">
          <div className="mb-10 flex h-fit items-start justify-start self-start">
            <IoClose
              className="icon brown-normal absolute top-3 right-4 cursor-pointer"
              size={26}
              onClick={() => setIsCarrinhoOpen(false)}
            />
          </div>

          {dados.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <img
                src={TechOpsLogo}
                alt="Logo TechOps"
                className="m-auto my-2 w-30"
              />
              <p className="mt-2 font-bold">Sua sacola está vazia!</p>
              <p className="mt-1 font-light">Adicione Itens</p>
            </div>
          ) : (
            <>
              <div className="border-gray-medium w-full border-b">
                <p className="mb-2">Seu pedido em:</p>
                <p className="mb-4 text-2xl font-bold">
                  {dados[0]?.restaurante?.nome}
                </p>
              </div>

              <div className="border-gray-medium mt-4 space-y-4 border-b">
                {dados.map((item: any) => (
                  <div key={item.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="mt-1">{item.quantidade} x</p>
                        <p className="font-bold">{item.nome}</p>
                      </div>
                      <p>R$ {item.subtotal.toFixed(2)}</p>
                    </div>
                    <p className="mt-2 font-light">{item.descricao}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="bg-gray-light mt-2 flex items-center justify-between gap-2 rounded-lg p-2">
                        <Button
                          color="plain"
                          onClick={() => decrementar(item.id)}
                          className="p-1"
                        >
                          <Minus size={20} className="stroke-2" />
                        </Button>
                        <span className="text-lg font-bold">
                          {item.quantidade}
                        </span>
                        <Button
                          color="plain"
                          onClick={() => incrementar(item.id)}
                          className="p-1"
                        >
                          <Plus size={20} className="stroke-2" />
                        </Button>
                      </div>
                      <Button
                        color="plain"
                        className="w-20 p-1"
                        onClick={() => removerItem(item.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
                <div>
                  <p className="my-2 flex items-center justify-between">
                    Subtotal
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </p>
                  <p className="my-2 flex items-center justify-between">
                    Taxa de entrega
                    <span>R$ {taxaEntregaRestaurante?.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <p className="flex items-center justify-between text-2xl font-bold">
                  Total
                  <span>R$ {(total + taxaEntregaRestaurante).toFixed(2)}</span>
                </p>
                <Button
                  className="mt-4 w-full p-2"
                  onClick={() => escolherFormaPagamento(setIsCarrinhoOpen)}
                >
                  Quero Comprar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
