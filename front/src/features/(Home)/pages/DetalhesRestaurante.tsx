import { Star, ChevronRight } from "lucide-react";
import Button from "../../../shared/components/ui/Button";
import CardProdutos from "../components/Cards/CardProdutos";
import { useRestaurante } from "../hooks/useRestaurante";
import { Loading } from "../../../shared/components/Loading";
import VerMaisRestaurante from "../components/VerMais/Index";
import IconAction from "@/shared/components/ui/IconAction";
import { useAuth } from "@/shared/contexts/AuthContext";
import { ImagemDeEntidade } from "@/shared/components/ui/ImagemEntidade";

export default function DetalhesRestaurante() {
  const { isAuthenticated } = useAuth();
  const {
    restaurante,
    loading,
    navigate,
    isModalOpen,
    setIsModalOpen,
    dadosProdutos,
  } = useRestaurante();
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {isAuthenticated ? (
        <div className="mx-auto">
          <IconAction
            className="hover:bg-brown-light-active mt-[5rem] flex cursor-pointer items-center justify-center gap-3 self-start rounded-md p-2"
            onClick={() => navigate("/")}
          >
            <p className="text-2xl">Voltar</p>
          </IconAction>

          <div className="relative mt-[2rem] h-48 w-full rounded-md md:h-64">
            <ImagemDeEntidade
              src={restaurante.logo}
              alt={restaurante.nome}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {restaurante.logo && (
                  <ImagemDeEntidade
                    src={restaurante.logo}
                    alt={restaurante.nome}
                    className="h-14 w-14 rounded-full border object-cover"
                  />
                )}
                <div className="flex flex-col justify-center">
                  <h1 className="text-blue text-2xl font-bold">
                    {restaurante.nome}
                  </h1>
                  <div className="text-muted-foreground mt-1 flex items-center text-sm">
                    <div className="text-brown-normal flex items-center">
                      <Star className="fill-brown-normal mr-1 h-4 w-4" />
                      <span className="text-base font-medium">4.2</span>
                    </div>
                    <span className="mx-2">•</span>
                    <span>{restaurante.especialidade}</span>
                  </div>
                </div>
              </div>

              <Button
                className="flex w-32 items-center rounded-md px-4 py-2"
                onClick={() => setIsModalOpen(true)}
              >
                Ver mais
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div
            id="produtos"
            className="mt-5 mb-[5rem] grid gap-12 min-[600px]:grid-cols-1 min-[1100px]:grid-cols-2 min-[1300px]:grid-cols-3"
          >
            {dadosProdutos.length === 0 ? (
              <p className="text-muted-foreground text-center">
                Nenhum produto disponível
              </p>
            ) : (
              dadosProdutos.map((produto, index) => (
                <CardProdutos
                  key={index}
                  {...produto}
                  dadosRestaurante={restaurante}
                />
              ))
            )}
          </div>

          {isModalOpen && (
            <VerMaisRestaurante onClose={() => setIsModalOpen(false)} />
          )}
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mt-[5rem] text-center">
            Para consultar os produtos disponíveis, realize o LOGIN.
          </p>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => navigate("/intermediaria")} className="w-80">
              Realizar Login
            </Button>
          </div>
        </>
      )}
    </>
  );
}
