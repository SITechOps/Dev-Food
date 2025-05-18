import { ICardOpcoesProps } from "@/interface/ICardOpcoes";

export default function CardOpcoes({ icon, title, subtitle, loading, onClick }: ICardOpcoesProps) {
  const styleOptions = "text-left hover:bg-brown-light hover:text-brown-normal text-blue cursor-pointer flex gap-6 items-center mb-5 border border-gray-medium hover:border-brown-light-active rounded-sm p-3 w-[25rem]";

  return (
    <button className={styleOptions} onClick={onClick}>
      <span className="text-2xl">{icon}</span>

      <div className="flex justify-between w-full gap-6 items-center">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="font-light">{subtitle}</p>
        </div>
        <span className="text-2xl animate-spin">{loading}</span>
      </div>
    </button>
  );
}
