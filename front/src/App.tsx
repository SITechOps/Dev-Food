import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loading } from "./components/Loading";
import Menu from "./components/Menu";

const Home = lazy(() => import("./pages/Home"));
const AuthUser = lazy(() => import("./pages/Auth/AuthUser"));
const Account = lazy(() => import("./pages/Account/Account"));
const CadastroEndereco = lazy(() => import("./components/CadastroEndereco"));
const CadastroRestaurante = lazy(
  () => import("./pages/Restaurante/CadastroRestaurante"),
);
const Intermediaria = lazy(() => import("./pages/Intermediaria"));
const DetalhesRestaurante = lazy(
  () => import("./components/InfoRestaurante/Detalhes"),
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthUser />} />
        <Route path="/account" element={<Account />} />
        <Route path="/c-endereco" element={<CadastroEndereco />} />
        <Route path="/restaurante/:id" element={<DetalhesRestaurante />} />
        <Route path="/intermediaria" element={<Intermediaria />} />
        <Route path="/cadastro-restaurante" element={<CadastroRestaurante />} />
      </Routes>
    </Suspense>
  );
}

export default App;
