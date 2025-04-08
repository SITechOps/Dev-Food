import { useEffect, useState } from "react";
import { api } from "../connection/axios";
import CardRestaurante from "../components/CardRestaurante";

export default function Home() {
  const [restaurants, setRestaurants] = useState([{
    id: "",
    especialidade: "",
  }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function listarRestaurantes() {
      try {
        const response = await api.get("/restaurantes");
        const data = response?.data?.data?.attributes || [];

        setRestaurants(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar restaurantes:", error);
        setLoading(false);
      }
    }

    listarRestaurantes();
  }, []);

  const groupedByCategory = restaurants.reduce(
    (acc: any, item: any) => {
      const category = item.especialidade || "Outros";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, typeof restaurants>,
  );

  return (
    <>
      <div className="mt-[5rem]">
        <h1 className="my-8 text-center font-medium">
          Conheça os restaurantes disponíveis
        </h1>
        <div className="mt-[5rem]">
          <div className="mx-auto max-w-7xl space-y-8 px-4 py-6">

            {loading ? (
              <div className="space-y-8">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx}>
                    <div className="mb-2 h-6 w-32 rounded bg-gray-200" />
                    <div className="flex gap-4">
                      {[...Array(5)].map((__, i) => (
                        <div className="h-48 w-60 animate-pulse rounded-2xl bg-gray-200" key={i} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              Object.entries(groupedByCategory).map(([category, items]) => (
                <section key={category}>
                  <h2 className="mb-3 text-lg font-semibold text-gray-800">
                    {category}
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {Array.isArray(items) &&
                      items.map((restaurant, index) => (
                        <CardRestaurante
                          key={restaurant.id || `restaurant-${index}`}
                          content={restaurant}
                        />
                      ))}
                  </div>
                </section>
              ))
            )}
          </div>

        </div>
      </div>
    </>
  );
}
