import { Routes, Route } from "react-router-dom";
import Menu from "./componentes/Menu";
import Cadastro from "./pages/Cadastro";

function App() {
  return (
    <>
      <Menu />

      <div className="flex flex-col items-center justify-center min-h-screen w-full m-auto mt-5">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="text-3xl font-bold text-center m-2">
                  Falta pouco para matar sua fome!
                </h1>
                <Cadastro />
                <button>Sign in with Google 🚀 </button>
              </>
            }
          />
          <Route path="/cardapio" element={<h1>Cardápio</h1>} />
          <Route path="/pedidos" element={<h1>Meus Pedidos</h1>} />
          <Route path="/login" element={<h1>Login</h1>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
