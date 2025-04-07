import { useState, useEffect } from "react";
import { api } from "../connection/axios";
import Card from "../components/Card";

{
  /*
    {
  "data": {
    "nome": "Churrasco",
    "email": "churrasco@restaurante.com",
    "cnpj": "57856678128188",
    "razao_social": "bl LTDA",
    "especialidade": "Hamburguer",
    "telefone": "(11) 9704-4345",
    "horario_funcionamento": "08:00 - 22:00",
    "banco": "Itaú Unibanco",
    "agencia": "1245",
    "nro_conta": "8857",
    "tipo_conta": "Corrente",
    "endereco": {
      "logradouro": "Rua Maria Lima",
      "bairro": "Vila Mariana",
      "cidade": "São Paulo",
      "estado": "São Paulo",
      "pais": "Brasil",
      "numero": 800,
      "complemento": "Faculdade"
    }
  }
}
*/
}

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await api.get(`http://127.0.0.1:5000/restaurants/`);
       ,
        setRestaurants(
          data.map((restaurant) => ({
            id: restaurant.cnpj,
            img: "/placeholder.svg",
            name: restaurant.nome,
            rate: 4.5,
            category: restaurant.especialidade,
          })),
        );
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar restaurantes:", error);
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p>Carregando restaurantes...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} content={restaurant} />
        ))}
      </div>
    </div>
  );
}
