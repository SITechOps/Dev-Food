import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const AuthUser = lazy(() => import("../pages/Auth/AuthUser"));
const Intermediaria = lazy(() => import("../pages/Intermediaria"));
const Account = lazy(() => import("../pages/Account/Account"));
const Cardapio = lazy(() => import("./Cardapios"));
const CadastroEndereco = lazy(() => import("../components/CadastroEndereco"));
const CadastroRestaurante = lazy(
  () => import("../pages/Usuario/Restaurante/FormRestaurante/CadastroRestaurante"),
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
      <Route path="/cardapios" element={<Cardapio />} />
    </Routes>
  );
};

export default AppRoutes;
