import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import RestrictRestauranteOnly from "./RestrictRestaurant";

const Entregador = lazy(
  () => import("../features/(Restaurante)/pages/Entregador"),
);
const Error404 = lazy(() => import("@/features/Error404"));
const Home = lazy(() => import("../features/(Home)"));
const FiltroLupa = lazy(
  () => import("../features/(Home)/components/Filtros/FiltroLupa"),
);
const AuthUser = lazy(() => import("../features/(Auth)/pages/AuthUser"));
const Intermediaria = lazy(
  () => import("../features/(Auth)/pages/Intermediaria"),
);
const Account = lazy(() => import("../features/(Auth)/pages/Account"));
const Cardapio = lazy(
  () => import("../features/(Restaurante)/pages/Cardapios"),
);
const Financeiro = lazy(
  () => import("../features/(Restaurante)/pages/Financeiro"),
);
const StatusPedido = lazy(
  () => import("../features/(Usuario)/pages/StatusPedido"),
);
const CadastroEndereco = lazy(
  () => import("../features/(Usuario)/components/Endereco/CadastroEndereco"),
);
const CadastroRestaurante = lazy(
  () => import("../features/(Restaurante)/pages/CadastroRestaurante"),
);
const DetalhesRestaurante = lazy(
  () => import("../features/(Home)/pages/DetalhesRestaurante"),
);
const AlterarEnderecoRestaurante = lazy(
  () => import("../features/(Restaurante)/pages/Endereco"),
);
const Pagamento = lazy(() => import("../features/(Usuario)/pages/Pagamento"));
const Pedidos = lazy(() => import("../features/(Restaurante)/pages/Pedidos"));

const MeusPedidos = lazy(
  () => import("../features/(Usuario)/pages/MeusPedidos"),
);
const ListagemEndereco = lazy(
  () => import("../features/(Usuario)/components/Endereco/ListagemEndereco"),
);

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
        <Route path="/listagem-endereco" element={<ListagemEndereco />} />
        <Route
          path="/alterar-endereco"
          element={<AlterarEnderecoRestaurante />}
        />
      </Route>

      {/* Apenas para CLIENTE */}
      <Route element={<RoleBasedRoute allowedRoles={["usuario"]} />}>
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/status-pedido" element={<StatusPedido />} />
        <Route path="/historico" element={<MeusPedidos />} />
      </Route>

      <Route element={<RestrictRestauranteOnly />}>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<FiltroLupa />} />
        <Route path="/restaurante/:id" element={<DetalhesRestaurante />} />
      </Route>

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
