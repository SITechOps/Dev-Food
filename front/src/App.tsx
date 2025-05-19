import { Suspense } from "react";
import { Loading } from "./shared/components/Loading";
import Menu from "./shared/components/Menu";
import LayoutRestaurante from "./features/(Restaurante)";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./contexts/AuthContext";
import { CarrinhoProvider } from "./contexts/CarrinhoContext";
import { TaxaEntregaProvider } from "./contexts/TaxaEntregaContext";
import { PagamentoProvider } from "./contexts/PagamaentoContext";
import { RestauranteProdutoProvider } from "./contexts/VisaoCliente/Restaurante&ProdutoContext";
import { ConfirmacaoEnderecoProvider } from "./contexts/ConfirmacaoEnderecoContext";
import AlertasPersonalizados from "./shared/components/ui/AlertasPersonalizados/Alertas";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Menu />
      <div className="text-blue mx-auto w-4/5 max-w-screen-xl">
        <main>{children}</main>
      </div>
    </>
  );
};

export default function App() {
  const { userData, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <AlertasPersonalizados />
      <ConfirmacaoEnderecoProvider>
        <CarrinhoProvider>
          <AppWrapper>
            {isAuthenticated && userData?.role === "restaurante" ? (
              <LayoutRestaurante>
                <AppRoutes />
              </LayoutRestaurante>
            ) : (
              <TaxaEntregaProvider>
                <PagamentoProvider>
                  <RestauranteProdutoProvider>
                    <AppRoutes />
                  </RestauranteProdutoProvider>
                </PagamentoProvider>
              </TaxaEntregaProvider>
            )}
          </AppWrapper>
        </CarrinhoProvider>
      </ConfirmacaoEnderecoProvider>
    </Suspense>
  );
}
