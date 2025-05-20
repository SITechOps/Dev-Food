interface BotaoFiltroDistanciaProps {
  filtroAtivo: boolean;
  distanciaSelecionada: number;
  onAbrirModal: () => void;
  onLimparFiltro: () => void;
  categoriaSelecionada: string;
  filtradosCount: number;
  totalRestaurantes: number;
}

export default function BotaoFiltroDistancia({
  filtroAtivo,
  distanciaSelecionada,
  onAbrirModal,
  onLimparFiltro,
  categoriaSelecionada,
  filtradosCount,
  totalRestaurantes,
}: BotaoFiltroDistanciaProps) {
  const filtroVisivel =
    filtroAtivo &&
    categoriaSelecionada === "Todos" &&
    filtradosCount < totalRestaurantes;

  const handleClick = () => {
    if (filtroVisivel) {
      onLimparFiltro();
    } else {
      onAbrirModal();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${
        filtroVisivel
          ? "bg-brown-normal hover:bg-brown-dark text-white" // para hover manter contraste
          : "text-brown-normal hover:bg-brown-light bg-white"
      } border-brown-normal flex items-center gap-2 rounded-[10px] border px-6 py-2 text-sm font-semibold shadow transition-all duration-200`}
    >
      {filtroVisivel ? (
        <>{distanciaSelecionada} km</>
      ) : (
        <>Filtrar por Distância</>
      )}
      <svg
        className={`h-4 w-4 ${filtroVisivel ? "text-white" : "text-brown-normal"}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
}
