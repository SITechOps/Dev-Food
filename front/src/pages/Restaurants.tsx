import { useState, useEffect } from "react";
import { api } from "../connection/axios";
import Card from "../components/Card";
import Skeleton from "../components/Skeleton";
import Input from "../components/Input";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await api.get("http://127.0.0.1:5000/restaurantes");
        const data = response?.data?.data?.attributes || [];

        // delay de 3s para mostrar skeleton
        setTimeout(() => {
          setRestaurants(data);
          setLoading(false);
        }, 3000);
      } catch (error) {
        console.error("Erro ao buscar restaurantes:", error);
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  const groupedByCategory = restaurants.reduce(
    (acc, item) => {
      const category = item.especialidade || "Outros";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, typeof restaurants>,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Restaurantes</h1>

        <div className="max-w-md">
          <Input placeholder="Buscar restaurantes..." className="w-full" />
        </div>
      </header>

      {loading ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, idx) => (
            <div key={idx}>
              <div className="mb-2 h-6 w-32 rounded bg-gray-200" />
              <div className="flex gap-4">
                {[...Array(5)].map((__, i) => (
                  <Skeleton key={i} />
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
              {items.slice(0, 5).map((restaurant) => (
                <Card key={restaurant.id} content={restaurant} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
