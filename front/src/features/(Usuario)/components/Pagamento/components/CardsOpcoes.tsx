import { ICardOpcoesProps } from "@/features/(Usuario)/components/Pagamento/interface/ICardOpcoes";

export default function CardOpcoes({
  icon,
  title,
  subtitle,
  loading,
  onClick,
}: ICardOpcoesProps) {
  const styleOptions =
    "text-left hover:bg-brown-light hover:text-brown-normal text-blue cursor-pointer flex gap-6 items-center mb-5 border border-gray-medium hover:border-brown-light-active rounded-sm p-3 w-[25rem]";

  return (
    <button className={styleOptions} onClick={onClick}>
      <span className="text-2xl">{icon}</span>

      <div className="flex w-full items-center justify-between gap-6">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="font-light">{subtitle}</p>
        </div>
        <span className="animate-spin text-2xl">{loading}</span>
      </div>
    </button>
  );
}
