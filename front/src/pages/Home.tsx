import { useEffect, useState } from "react";
import { api } from "../connection/axios";
import Card from "../components/InfoRestaurante/Card";

export default function Home() {
  const [restaurantees, setrestaurantees] = useState([
    {
      id: "",
      especialidade: "",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function listarrestaurantees() {
      try {
        const response = await api.get("/restaurantees");
        const data = response?.data?.data?.attributes || [];

        setrestaurantees(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar restaurantees:", error);
        setLoading(false);
      }
    }

    listarrestaurantees();
  }, []);

  const grupoCategoria = restaurantees.reduce(
    (acc: any, item: any) => {
      const categoria = item.especialidade || "Outros";
      if (!acc[categoria]) acc[categoria] = [];
      acc[categoria].push(item);
      return acc;
    },
    {} as Record<string, typeof restaurantees>,
  );

  return (
    <>
      <div className="mt-[5rem]">
        <h1 className="my-8 text-center font-medium">
          Conheça os restaurantees disponíveis
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
                        <div
                          className="h-48 w-60 animate-pulse rounded-2xl bg-gray-200"
                          key={i}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              Object.entries(grupoCategoria).map(([categoria, items]) => (
                <section key={categoria}>
                  <h2 className="mb-3 text-lg font-semibold text-gray-800">
                    {categoria}
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {Array.isArray(items) &&
                      items.map((restaurante, index) => (
                        <Card
                          key={restaurante.id || `restaurante-${index}`}
                          content={restaurante}
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
