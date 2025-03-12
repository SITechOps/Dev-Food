import Cadastro from "./pages/Cadastro";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full m-auto mt-5">
      <h1 className="font-bold text-center m-2">
        Falta pouco para matar sua fome! <br/>
       <span className="font-medium">Cadastra-se </span>
      </h1>
      <Cadastro />
    </div>
  );
}
export default App;
