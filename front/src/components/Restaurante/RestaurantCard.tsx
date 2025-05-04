import { memo, useMemo } from "react";
import { IRestaurante } from "@/interface/IRestaurante";

type RestauranteProps = {
  restaurante: IRestaurante & {
    duration?: number;
    distancia?: number;
    taxaEntrega?: number;
  };
};

const RestauranteCard = memo(({ restaurante }: RestauranteProps) => {
  const formattedDuration = useMemo(
    () => ((restaurante.duration ?? 0) / 60).toFixed(0),
    [restaurante.duration],
  );

  return (
    <div className="rounded-lg border bg-white p-4 shadow-md">
      <img
        src={
          restaurante.logo ||
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt={restaurante.nome}
        loading="lazy"
        className="h-32 w-full rounded object-cover"
      />
      <h3 className="mt-2 font-semibold">{restaurante.nome}</h3>
      <p className="text-blue text-sm">
        {restaurante.especialidade} • {restaurante.distancia ?? ""} km
      </p>
      <p className="text-blue text-sm">
        {formattedDuration} min •{" "}
        <span className="text-green-dark">
          {restaurante.taxaEntrega === 0 ||
          restaurante.taxaEntrega === undefined
            ? "Grátis"
            : `R$ ${restaurante.taxaEntrega.toFixed(2)}`}
        </span>
      </p>
    </div>
  );
});

export default RestauranteCard;
