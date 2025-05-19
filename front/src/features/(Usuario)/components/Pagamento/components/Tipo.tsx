import { ITipoProps } from "@/interface/IPagamento";

export default function Tipo({ icon, descricao, tipo, tipoSelecionado, onClick }: ITipoProps) {
  const isSelected = tipo === tipoSelecionado;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center space-x-2 rounded px-2 py-1 transition-all duration-300 ease-in-out border-2
        ${isSelected ? "border-brown-normal text-brown-normal" : "border text-gray-medium hover:border-gray-medium"}
      `}
    >
      <span className="flex gap-2 items-center">
        {icon}
        <p>{descricao}</p>
      </span>
    </button>
  );
}
