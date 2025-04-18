import { Star, Clock, MapPin, ChevronRight } from "lucide-react";
import { IoClose } from "react-icons/io5";
import Button from "../../components/ui/Button";
import CardProdutos from "./ProdutoDisponiveis/Index";
import { useRestauranteDisponiveisDetalhes } from "../../hooks/useRestauranteDisDetalhes";

export default function DetalhesRestaurante() {
    const {
      restaurante,
      loading,
      isModalOpen,
      setIsModalOpen,
      jsonProdutos
    } = useRestauranteDisponiveisDetalhes();

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
      <div className="relative mt-[5rem] h-48 w-full rounded-md md:h-64">
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
            className="flex w-28 items-center rounded-md px-4 py-2"
            onClick={() => setIsModalOpen(true)}
          >
            Ver mais
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
      <div id="produtos" className="flex flex-col md:flex-row gap-8 mt-4 justify-between">
        {jsonProdutos.produtos.map((produto) => (
          <CardProdutos
            key={produto.id}
            id={produto.id}
            nome={produto.nome}
            descricao={produto.descricao}
            imageUrl={produto.imageUrl}
            valor_unitario={produto.valor_unitario}
          />
        ))}
      </div>


      {/* Modal lateral */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70">
          <div className="h-full w-full max-w-md overflow-y-auto bg-white">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="mt-8 text-xl font-bold">
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
