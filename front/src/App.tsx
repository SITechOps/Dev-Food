import { Suspense } from "react";
import { Loading } from "./components/Loading";
import Menu from "./components/Menu";
import LayoutRestaurante from "./components/LayoutRestaurante";
import AppRoutes from "./components/AppRoutes";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { userData, isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<Loading />}>
      <Menu />

      {isAuthenticated && userData?.role === "restaurante" ? (
        <LayoutRestaurante>
          <AppRoutes />
        </LayoutRestaurante>
      ) : (
        <AppRoutes />
      )}
    </Suspense>
  );
}

export default App;
