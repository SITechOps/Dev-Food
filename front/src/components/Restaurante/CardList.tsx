// RestauranteCardList.tsx

import Card from "../../pages/RestaurantesDisponiveis/Card";

interface Restaurante {
  id: string;
  nome: string;
  especialidade: string;
  [key: string]: any;
}

interface Props {
  grupoCategoria: Record<string, Restaurante[]>;
}

export default function RestauranteCardList({ grupoCategoria }: Props) {
  return (
    <>
      {Object.entries(grupoCategoria).map(([categoria, items]) => (
        <section key={categoria}>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            {categoria}
          </h2>
          <div className="flex flex-wrap gap-6">
            {Array.isArray(items) &&
              items.map((restaurante, index) => (
                <Card
                  key={restaurante.id || `restaurante-${index}`}
                  content={restaurante}
                />
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
