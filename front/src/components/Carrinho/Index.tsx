import { IoClose } from "react-icons/io5";
import Button from "../ui/Button";
import { Minus, Plus } from "lucide-react";
import { useCarrinho } from "../../hooks/useCarinho";
import ifoodLogo from "../../assets/ifood.png";

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
    taxaEntrega,
    total,
    escolherFormaPagamento
  } = useCarrinho(); 

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70">
        <div className="h-full w-full max-w-md bg-white p-6 relative overflow-auto scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
          <div className="mb-10 flex items-start justify-start h-fit self-start">
            <IoClose
              className="icon absolute top-3 right-4 brown-normal cursor-pointer"
              size={26}
              onClick={() => setIsCarrinhoOpen(false)}
            />
          </div>

          {dados.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full">
              <img
                src={ifoodLogo}
                alt="Logo Ifood"
                className="w-30 m-auto my-2"
              />
              <p className="mt-2 font-bold">Sua sacola está vazio</p>
              <p className="mt-1 font-light">Adicione Itens</p>
            </div>
          ) : (
            <>
              <div className="w-full border-b border-gray-medium">
                <p className="mb-2">Seu pedido em:</p>
                <p className="font-bold text-2xl mb-4">
                  {dados[0]?.restaurante?.nome}
                </p>
              </div>

              <div className="space-y-4 border-b border-gray-medium mt-4">
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
                    <div className="flex items-center mt-2 gap-2">
                      <div className="flex gap-2 p-2 mt-2 items-center justify-between rounded-lg bg-gray-light">
                        <Button
                          color="plain"
                          onClick={() => decrementar(item.id)}
                          className="p-1"
                        >
                          <Minus size={20} className="stroke-2" />
                        </Button>
                        <span className="text-lg font-bold">{item.quantidade}</span>
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
                        className="p-1 w-20"
                        onClick={() => removerItem(item.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
                <div>
                  <p className="flex items-center justify-between my-2">
                    Subtotal
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </p>
                  <p className="flex items-center justify-between my-2">
                    Taxa de entrega
                    <span>R$ {taxaEntrega.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <p className="flex items-center justify-between font-bold text-2xl">
                  Total
                  <span>R$ {total.toFixed(2)}</span>
                </p>
                <Button className="p-2 w-full mt-4" onClick={() => escolherFormaPagamento(setIsCarrinhoOpen)}>
                  Escolher a forma de pagamento
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
