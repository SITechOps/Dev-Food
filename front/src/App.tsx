import { Suspense } from "react";
import { Loading } from "./components/shared/Loading";
import Menu from "./components/shared/Menu";
import LayoutRestaurante from "./components/Restaurante/LayoutRestaurante";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./contexts/AuthContext";
import { CarrinhoProvider } from "./contexts/CarrinhoContext";

export default function App() {
  const { userData, isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<Loading />}>
      <CarrinhoProvider>
        <Menu />

        {isAuthenticated && userData?.role === "restaurante" ? (
          <LayoutRestaurante>
            <AppRoutes />
          </LayoutRestaurante>
        ) : (
          <AppRoutes />
        )}
      </CarrinhoProvider>
    </Suspense>
  );
}

