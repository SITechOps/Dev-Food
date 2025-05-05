import { memo, useMemo } from "react";
import { IRestaurante } from "@/interface/IRestaurante";
import { ImagemDeEntidade } from "../ui/ImagemEntidade";

type RestauranteProps = {
  restaurant: IRestaurante;
  duration?: number;
  distancia?: number;
  taxaEntrega?: number;
};

const RestauranteCard = memo(({ restaurante }: RestauranteProps) => {
  const formattedDuration = useMemo(
    () => ((restaurante.duration ?? 0) / 60).toFixed(0),
    [restaurante.duration],
  );

  return (
    <div className="rounded-lg border bg-white p-4 shadow-md">
      <ImagemDeEntidade
        src={restaurante.logo}
        alt={restaurante.nome}
        className="h-32 w-full rounded object-cover"
      />
      <h3 className="mt-2 font-semibold">{restaurante.nome}</h3>
      <p className="text-blue text-sm">
        {restaurante.especialidade} • {restaurante.distancia?.toFixed(1) ?? ""}{" "}
        km
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
