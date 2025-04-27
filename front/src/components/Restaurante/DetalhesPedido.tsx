import { IPedido } from "../../interface/IPedidos";
import Button from "@/components/ui/Button";
import { usePedidos } from "@/hooks/usePedidos";
import { Package, CreditCard, MapPin, ShoppingBag } from "lucide-react";

interface DetalhesPedidoProps {
  pedido: IPedido;
}

const iconStyle = "mr-2 text-gray-medium w-5 h-5";

const DetalhesPedido: React.FC<DetalhesPedidoProps> = ({ pedido }) => {
  const { formatarData } = usePedidos();

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "text-brown-dark";
      case "Em preparo":
        return "text-orange";
      default:
        return "text-gray-medium";
    }
  };

  const getButtonStyles = (status: string) => {
    switch (status) {
      case "Pendente":
        return {
          buttonClass: "bg-brown-normal text-white",
          buttonText: "Confirmar",
        };
      case "Em preparo":
        return {
          buttonClass: "bg-green-dark hover:bg-green text-white",
          buttonText: "Despachar",
        };
      default:
        return {
          buttonClass: "bg-brown-normal hover:bg-brown-dark text-white",
          buttonText: "Confirmar",
        };
    }
  };

  const { buttonClass, buttonText } = getButtonStyles(pedido.status);

  return (
    <div className="flex flex-col gap-6 rounded-lg bg-white p-8">
      <h2 className="text-blue text-2xl font-bold">
        Pedido #{pedido.id?.slice(0, 4)}
      </h2>

      <span className="text-gray-medium">
        Feito em {formatarData(pedido.dataPedido)}
      </span>

      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <Package className={iconStyle} />
          <label className="text-gray-medium text-sm">Status do Pedido</label>
        </div>
        <span className={`font-bold ${getStatusTextColor(pedido.status)}`}>
          {pedido.status}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <CreditCard className={iconStyle} />{" "}
          <label className="text-gray-medium text-sm">Forma de Pagamento</label>
        </div>
        <span>
          {pedido.formaPagamento} - R$ {pedido.valorTotal}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <MapPin className={iconStyle} />
          <label className="text-gray-medium text-sm">Endereço</label>
        </div>
        <span>
          {pedido.endereco.logradouro} {pedido.endereco.numero} -{" "}
          {pedido.endereco.cidade}
        </span>
        <span>{pedido.tipoEntrega}</span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <ShoppingBag className={iconStyle} />
          <label className="text-gray-medium text-sm">Itens do Pedido</label>
        </div>
        {pedido.itens.map((item, idx) => (
          <span key={idx}>
            {item.qtdItens}x {item.produto}
          </span>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          color="outlined"
          className="border-brown-normal text-brown-normal hover:bg-brown-light-active mr-4 border-2"
        >
          Cancelar
        </Button>

        <Button color="default" className={`${buttonClass} border-2`}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default DetalhesPedido;
