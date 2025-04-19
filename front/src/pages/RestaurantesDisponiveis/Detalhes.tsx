import { Star, ChevronRight } from "lucide-react";
import Button from "../../components/ui/Button";
import CardProdutos from "./ProdutoDisponiveis/Index";
import { useRestauranteDisponiveisDetalhes } from "../../hooks/useRestauranteDisDetalhes";
import { FaAngleLeft } from "react-icons/fa6";
import { Loading } from "../../components/shared/Loading";
import VerMaisRestaurante from "./VerMais/Index";


export default function DetalhesRestaurante() {
  const {
    restaurante,
    loading,
    navigate,
    isModalOpen,
    setIsModalOpen,
    jsonProdutos
  } = useRestauranteDisponiveisDetalhes();
  
  if (loading) {
    return <Loading />;
  }

  return (
    
    <div className="mx-auto pb-10">
      <button
        onClick={() => navigate("/")}
        className="mt-[5rem] self-start flex items-center justify-center gap-3 hover:bg-brown-light-active p-2 rounded-md cursor-pointer"
      >
        <FaAngleLeft className="icon" /> <p className="text-2xl">Voltar</p>
      </button>
      <div className="relative mt-[2rem] h-48 w-full rounded-md md:h-64">
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
            onClick={() =>  setIsModalOpen(true) }
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
      {isModalOpen && (
        <VerMaisRestaurante
        onClose={() => setIsModalOpen(false)} />
      )}

    </div>
  );
}
