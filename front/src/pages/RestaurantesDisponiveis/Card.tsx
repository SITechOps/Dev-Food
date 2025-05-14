import { useMemo, useState } from "react";
import { IRestaurante } from "@/interface/IRestaurante";
import { Link } from "react-router-dom";

type RestauranteProps = {
  restaurante: IRestaurante & {
  };
};

export default function CardRestaurante({ restaurante }: RestauranteProps) {
  const [loading, setLoading] = useState(true);

  const formattedDuration = useMemo(
    () => ((restaurante.duration ?? 0) / 60).toFixed(0),
    [restaurante.duration],
  );

  const handleClick = () => {
    localStorage.setItem("idRestaurante", JSON.stringify(restaurante.id));
    localStorage.setItem("restauranteSelecionado", JSON.stringify(restaurante));
  };

  return (
    <Link to={`/restaurante/${restaurante.id}`} onClick={handleClick}>
    <div className="rounded-lg border  bg-white hover:border-2 hover:border-green-dark hover:shadow-lg">
      <div className="h-36 w-full">
        <img
          src={
            restaurante.logo ||
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={restaurante.nome}
          className="h-full w-full object-cover"
          // loading="lazy"
          onLoad={() => setLoading(false)}
        />
      </div>
      <div className="p-3">
        <h3 className="truncate font-semibold">{restaurante.nome}</h3>

        <p className="text-blue text-sm">
          {restaurante.especialidade} • {restaurante.distancia ?? ""} km
        </p>
        <p className="text-blue text-sm">
          {formattedDuration} min •{" "}
          <span className="text-green-dark">
            {restaurante.taxa_entrega === 0 ||
              restaurante.taxa_entrega === undefined
              ? "Grátis"
              : `R$ ${restaurante.taxa_entrega.toFixed(2)}`}
          </span>
        </p>
      </div>
    </div>
    </Link>
  );
}
