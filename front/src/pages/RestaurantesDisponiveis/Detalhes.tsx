import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Clock, MapPin, ChevronRight } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { api } from "../../connection/axios";
import Button from "../../components/Button";

export default function DetalhesRestaurante() {
  const { id } = useParams();

  const [restaurante, setRestaurante] = useState({
    nome: "",
    descricao: "",
    especialidade: "",
    endereco: {
      logradouro: "",
      bairro: "",
      cidade: "",
      estado: "",
      pais: "",
    },
    horario_funcionamento: "",
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function getDetalhesRestaurante() {
      try {
        const response = await api.get(`/restaurante/${id}`);
        setRestaurante(response.data.data.attributes);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar detalhes do restaurante:", error);
        setLoading(false);
      }
    }

    getDetalhesRestaurante();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p>Carregando detalhes do restaurante...</p>
      </div>
    );
  }

  if (!restaurante) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p>Não foi possível carregar os detalhes do restaurante.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10">
      <div className="relative h-48 w-full md:h-64 mt-[5rem] rounded-md">
        <img
          src={
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={"restaurant"}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="px-4 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">
              {restaurante.nome}
            </h1>
            <div className="mt-1 flex items-center">
              <div className="text-brown-normal flex items-center">
                <Star className="fill-brown-normal mr-1 h-5 w-5" />
                <span className="font-medium">4.2</span>
              </div>
              <span className="text-muted-foreground mx-2">•</span>
              <span className="text-muted-foreground">
                {restaurante.especialidade}
              </span>
            </div>
          </div>

          <Button
            className="flex items-center rounded-md px-4 py-2 w-28"
            onClick={() => setIsModalOpen(true)}
          >
            Ver mais
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Modal lateral */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70">
          <div className="h-full w-full max-w-md overflow-y-auto bg-white">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold mt-8">
                  Informações do Restaurante
                </h2>
                <IoClose
                  className="icon absolute top-3 right-4"
                  size={26}
                  onClick={() => setIsModalOpen(false)}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 font-semibold">Descrição</h3>
                  <p className="text-gray-600">{restaurante.descricao}</p>
                </div>

                <hr className="text-gray-normal" />

                <div>
                  <h3 className="mb-2 flex items-center font-semibold">
                    <MapPin className="text-brown-normal mr-2 h-4 w-4" />
                    Endereço
                  </h3>
                  <p className="text-gray-600">
                    {restaurante.endereco.logradouro},{" "}
                    {restaurante.endereco.bairro}, {restaurante.endereco.cidade}
                    , {restaurante.endereco.estado}, {restaurante.endereco.pais}
                  </p>
                </div>

                <hr className="text-gray-normal" />

                <div>
                  <h3 className="mb-2 flex items-center font-semibold">
                    <Clock className="text-brown-normal mr-2 h-4 w-4" />
                    Horário de Funcionamento
                  </h3>
                  <p className="text-gray-600">
                    {restaurante.horario_funcionamento}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
