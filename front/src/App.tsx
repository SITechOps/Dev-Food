import { Suspense } from "react";
import { Loading } from "./components/shared/Loading";
import Menu from "./components/shared/Menu";
import LayoutRestaurante from "./components/Restaurante/LayoutRestaurante";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./contexts/AuthContext";
import { CarrinhoProvider } from "./contexts/CarrinhoContext";
import { TaxaEntregaProvider } from "./contexts/TaxaEntregaContext";
import { PagamentoProvider } from "./contexts/PagamaentoContext";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Menu />
      <div className="text-blue mx-auto w-4/5 max-w-screen-xl pt-[72px]">
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
      <CarrinhoProvider>
        <AppWrapper>
          {isAuthenticated && userData?.role === "restaurante" ? (
            <LayoutRestaurante>
              <AppRoutes />
            </LayoutRestaurante>
          ) : (
            <PagamentoProvider>
              <TaxaEntregaProvider>
                <AppRoutes />
              </TaxaEntregaProvider>
            </PagamentoProvider>
          )}
        </AppWrapper>
      </CarrinhoProvider>
    </Suspense>
  );
}
