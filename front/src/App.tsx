import Cadastro from "./pages/Cadastro";

function App() {
  return (
    <div className="w-screen h-screen bg-red-100 flex flex-col items-center p-6">
      <h1 className="text-3xl text-stone-950 font-bold text-center m-2">
        Cadastre-se
      </h1>
      <Cadastro />
    </div>
  );
}
export default App;
