import { Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loading } from "../../components/shared/Loading";

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
  const [loading, setLoading] = useState(true);
  const notaRestaurante = useMemo(() => {
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
              onLoad={() => setLoading(false)} 
            />
          </div>
          <div className="p-3">
            <h3 className="truncate font-semibold">{content.nome}</h3>
            <div className="mt-1 flex items-center text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="fill-brown-normal icon mr-1 size-4" />
                <span className="font-medium">{notaRestaurante}</span>
              </div>
              <span className="mx-2">•</span>
              <span>{content.categoria}</span>
            </div>
          </div>
        </div>
      </Link>
  );
}
