import { useEffect, useMemo, useState } from "react";
import { IRestaurante } from "@/shared/interfaces/IRestaurante";
import { Link } from "react-router-dom";
import { ImagemDeEntidade } from "@/shared/components/ui/ImagemEntidade";
import { Loader2 } from "lucide-react";

type RestauranteProps = {
  restaurante: IRestaurante & {};
};

export default function CardRestaurante({ restaurante }: RestauranteProps) {
  const [loading, setLoading] = useState(true);

  // Simula carregamento de dados (pode ser removido se já tiver loading real)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // tempo fictício
    return () => clearTimeout(timeout);
  }, []);

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
      <div className="hover:border-green-dark rounded-lg border bg-white hover:border-2 hover:shadow-lg">
        <div className="h-36 w-full">
          <ImagemDeEntidade
            src={restaurante.logo}
            alt={restaurante.nome}
            className="h-32 w-full rounded object-cover"
          />
        </div>
        <div className="p-3">
          <h3 className="truncate font-semibold">{restaurante.nome}</h3>

          <p className="text-blue text-sm">
            {loading ? (
              <Loader2 className="inline h-4 w-4 animate-spin" />
            ) : (
              <>
                {restaurante.especialidade} •{" "}
                {restaurante.distancia?.toFixed(1) ?? ""} km
              </>
            )}
          </p>
          <p className="text-blue text-sm">
            {formattedDuration} min •{" "}
            <span className="text-green-dark">
              {loading ? (
                <Loader2 className="inline h-4 w-4 animate-spin" />
              ) : restaurante.taxa_entrega == null ||
                restaurante.taxa_entrega === 0 ? (
                "Grátis"
              ) : (
                `R$ ${Number(restaurante.taxa_entrega).toFixed(2)}`
              )}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
