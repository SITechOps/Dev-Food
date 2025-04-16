import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const Home = lazy(() => import("../pages/Home"));
const AuthUser = lazy(() => import("../pages/Auth/AuthUser"));
const Intermediaria = lazy(() => import("../pages/Intermediaria"));
const Account = lazy(() => import("../pages/Account"));
const Cardapio = lazy(() => import("../components/Restaurante/Cardapios"));
const Financeiro = lazy(() => import("../components/Restaurante/Financeiro"));
const CadastroEndereco = lazy(
  () => import("../components/Endereco/CadastroEndereco"),
);
const CadastroRestaurante = lazy(
  () =>
    import("../pages/Usuario/Restaurante/FormRestaurante/CadastroRestaurante"),
);
const DetalhesRestaurante = lazy(
  () => import("../pages/RestaurantesDisponiveis/Detalhes"),
);
const AlterarEnderecoRestaurante = lazy(
  () => import("../components/Endereco/EnderecoModal"),
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas privadas — só acessa se estiver logado */}
      <Route element={<ProtectedRoute />}>
        <Route path="/account" element={<Account />} />
        <Route path="/cardapios" element={<Cardapio />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/c-endereco" element={<CadastroEndereco />} />
        <Route
          path="/alterar-endereco"
          element={<AlterarEnderecoRestaurante />}
        />
      </Route>

      {/* Rotas neutras — ambos podem acessar */}
      <Route path="/" element={<Home />} />
      <Route path="/restaurante/:id" element={<DetalhesRestaurante />} />

      {/* Rotas públicas — bloqueia se já estiver logado */}
      <Route element={<PublicRoute />}>
        <Route path="/auth" element={<AuthUser />} />
        <Route path="/intermediaria" element={<Intermediaria />} />
        <Route path="/cadastro-restaurante" element={<CadastroRestaurante />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
