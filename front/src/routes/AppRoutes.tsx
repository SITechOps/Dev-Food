import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import RestrictRestauranteOnly from "./RestrictRestaurant";

const Entregador = lazy(() => import("../pages/Pedido/Entregador"));
const Error404 = lazy(() => import("@/components/Error404"));
const Home = lazy(() => import("../pages/Home"));
const AuthUser = lazy(() => import("../pages/Auth/AuthUser"));
const Intermediaria = lazy(() => import("../pages/Intermediaria"));
const Account = lazy(() => import("../pages/Account"));
const Cardapio = lazy(() => import("../components/Restaurante/Cardapios"));
const Financeiro = lazy(() => import("../components/Restaurante/Financeiro"));
const StatusPedido = lazy(() => import("../pages/Pedido/StatusPedido"));
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
const Pagamento = lazy(() => import("../pages/Pagamento/Index"));
const Pedidos = lazy(() => import("../pages/Restaurante/Account/Pedidos"));

const MeusPedidos = lazy(() => import("../pages/MeusPedidos/Index"));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Acesso público */}
      <Route path="/auth" element={<AuthUser />} />
      <Route path="/intermediaria" element={<Intermediaria />} />
      <Route path="/cadastro-restaurante" element={<CadastroRestaurante />} />

      {/* Proteção geral para rotas privadas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/account" element={<Account />} />
        <Route path="/c-endereco" element={<CadastroEndereco />} />
        <Route
          path="/alterar-endereco"
          element={<AlterarEnderecoRestaurante />}
        />
      </Route>

      {/* Apenas para CLIENTE */}
      <Route element={<RoleBasedRoute allowedRoles={["usuario"]} />}>
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/status-pedido" element={<StatusPedido />} />
      </Route>

      <Route element={<RestrictRestauranteOnly />}>
        <Route path="/" element={<Home />} />
        <Route path="/restaurante/:id" element={<DetalhesRestaurante />} />
      </Route>
      <Route path="/historico" element={<MeusPedidos />} />

      {/* Apenas para RESTAURANTE */}
      <Route element={<RoleBasedRoute allowedRoles={["restaurante"]} />}>
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/cardapios" element={<Cardapio />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/entregador" element={<Entregador />} />
      </Route>
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default AppRoutes;
