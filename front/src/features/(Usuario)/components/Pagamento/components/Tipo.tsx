import { ITipoProps } from "@/features/(Usuario)/components/Pagamento/interface/IPagamento";

export default function Tipo({
  icon,
  descricao,
  tipo,
  tipoSelecionado,
  onClick,
}: ITipoProps) {
  const isSelected = tipo === tipoSelecionado;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center space-x-2 rounded border-2 px-2 py-1 transition-all duration-300 ease-in-out ${isSelected ? "border-brown-normal text-brown-normal" : "text-gray-medium hover:border-gray-medium border"} `}
    >
      <span className="flex items-center gap-2">
        {icon}
        <p>{descricao}</p>
      </span>
    </button>
  );
}
