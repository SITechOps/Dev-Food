import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const AuthUser = lazy(() => import("../pages/Auth/AuthUser"));
const Intermediaria = lazy(() => import("../pages/Intermediaria"));
const Account = lazy(() => import("../pages/Account"));
const Cardapio = lazy(() => import("./Cardapios"));
const Financeiro = lazy(() => import("./Financeiro"));
const CadastroEndereco = lazy(() => import("../components/CadastroEndereco"));
const CadastroRestaurante = lazy(
  () => import("../pages/FormRestaurante/CadastroRestaurante"),
);
const DadosRestaurante = lazy(
  () => import("../pages/FormRestaurante/DadosRestaurante"),
);
const DetalhesRestaurante = lazy(
  () => import("../pages/RestaurantesDisponiveis/Detalhes"),
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthUser />} />
      <Route path="/account" element={<Account />} />
      <Route path="/c-endereco" element={<CadastroEndereco />} />
      <Route path="/restaurante/:id" element={<DetalhesRestaurante />} />
      <Route path="/intermediaria" element={<Intermediaria />} />
      <Route path="/cadastro-restaurante" element={<CadastroRestaurante />} />
      <Route path="/dados-restaurante" element={<DadosRestaurante />} />
      <Route path="/cardapios" element={<Cardapio />} />
      <Route path="/financeiro" element={<Financeiro />} />
    </Routes>
  );
};

export default AppRoutes;
