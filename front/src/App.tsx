import Menu from "./components/Menu";
import Cadastro from "./pages/Cadastro";

function App() {
  return (
    <>
      <Menu />
      <div className="m-auto flex min-h-screen w-full flex-col items-center justify-center pt-10">
        <h1 className="m-2 text-center font-bold">
          Falta pouco para matar sua fome! <br />
        </h1>
        <Cadastro />
      </div>
    </>
  );
}

export default App;
