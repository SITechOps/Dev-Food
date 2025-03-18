import Menu from "./componentes/Menu";
import Cadastro from "./pages/Cadastro";

function App() {
  return (
    <>
      <Menu />
      <div className="flex flex-col items-center justify-center min-h-screen w-full m-auto mt-5 pt-28">
        <h1 className="font-bold text-center m-2">
          Falta pouco para matar sua fome! <br />
        </h1>
        <Cadastro />
      </div>
    </>
  );
}

export default App;
