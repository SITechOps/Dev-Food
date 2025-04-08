import { useMemo } from "react";
import { PiStarThin } from "react-icons/pi";
import { Link } from "react-router-dom";

type CardProps = {
  id: string;
  img: string;
  nome: string;
  avaliacao: number;
  categoria: string;
};

type Content = {
  content: CardProps;
};

export default function CardRestaurante({ content }: Content) {
  const randomRate = useMemo(() => {
    const min = 3.5;
    const max = 5.0;
    return (Math.random() * (max - min) + min).toFixed(1);
  }, []);
  return (
    <Link to={`/restaurante/${content.id}`}>
      <div className="w-60 overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
        <div className="h-36 w-full overflow-hidden">
          <img
            src={
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={content.nome}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-3">
          <h3 className="truncate font-semibold text-black text-gray-900">
            {content.nome}
          </h3>
          <div className="mt-1 flex items-center text-sm text-gray-600">
            <div className="flex items-center">
              <PiStarThin className="mr-1 h-4 w-4 bg-brown-normal" />
              <span className="font-medium">{randomRate}</span>
            </div>
            <span className="mx-2">•</span>
            <span>{content.categoria}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
