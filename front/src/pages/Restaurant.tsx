import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Clock, MapPin, ChevronRight } from "lucide-react";

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchRestaurantDetails() {
      try {
        const response = await fetch(`http://127.0.0.1:5000/restaurants/${id}`);
        const data = await response.json();
        setRestaurant(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar detalhes do restaurante:", error);
        // Fallback para dados de exemplo caso a API não esteja disponível
        setRestaurant({
          id,
          name: "Burger Express",
          rating: 4.7,
          category: "Lanches",
          imageUrl: "/placeholder.svg?height=200&width=600",
          description:
            "Os melhores lanches da cidade com ingredientes frescos e de qualidade. Entrega rápida e atendimento excepcional.",
          address: "Av. Paulista, 1234 - Bela Vista, São Paulo - SP",
          hours: "Segunda a Domingo: 11h às 23h",
          isSuperRestaurant: true,
        });
        setLoading(false);
      }
    }

    fetchRestaurantDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p>Carregando detalhes do restaurante...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-10">
      <div className="relative h-48 w-full md:h-64">
        <img
          src={restaurant.imageUrl || "/placeholder.svg?height=200&width=600"}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="px-4 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <div className="mt-1 flex items-center">
              <div className="flex items-center text-[#EA1D2C]">
                <Star className="mr-1 h-5 w-5 fill-[#EA1D2C]" />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
              <span className="text-muted-foreground mx-2">•</span>
              <span className="text-muted-foreground">
                {restaurant.category}
              </span>
            </div>
          </div>

          <button
            className="flex items-center rounded-md bg-[#EA1D2C] px-4 py-2 text-white hover:bg-[#D01021]"
            onClick={() => setIsModalOpen(true)}
          >
            Ver mais
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Modal lateral */}
      {isModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex justify-end bg-black">
          <div className="h-full w-full max-w-md overflow-y-auto bg-white">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Informações do Restaurante
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {restaurant.isSuperRestaurant && (
                  <div className="flex items-center">
                    <span className="rounded-full bg-[#EA1D2C] px-2 py-1 text-sm font-medium text-white">
                      Super-Restaurante
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="mb-2 font-semibold">Descrição</h3>
                  <p className="text-gray-600">{restaurant.description}</p>
                </div>

                <hr className="border-gray-200" />

                <div>
                  <h3 className="mb-2 flex items-center font-semibold">
                    <MapPin className="mr-2 h-4 w-4 text-[#EA1D2C]" />
                    Endereço
                  </h3>
                  <p className="text-gray-600">{restaurant.address}</p>
                </div>

                <hr className="border-gray-200" />

                <div>
                  <h3 className="mb-2 flex items-center font-semibold">
                    <Clock className="mr-2 h-4 w-4 text-[#EA1D2C]" />
                    Horário de Funcionamento
                  </h3>
                  <p className="text-gray-600">{restaurant.hours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
