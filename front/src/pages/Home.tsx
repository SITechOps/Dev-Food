import Menu from "../components/Menu";
import ListagemEndereco from "../components/ListagemEndereco";
import { decodeToken } from "../utils/decodeToken";
import CardRestaurante from "../components/CardRestaurante";

export default function Home() {
  const token = localStorage.getItem("token");
  const idUsuario = token ? decodeToken(token)?.sub : undefined;

  return (
    <>
      <Menu>
        <ListagemEndereco idUsuario={idUsuario} />
      </Menu>

      <div className="mt-[5rem]" >
        <h1 className="my-8 text-center font-medium">Conheça os restaurantes disponíveis</h1>
        <div className="flex gap-8 justify-center mt-[5rem]">
          <CardRestaurante />
          <CardRestaurante />
          <CardRestaurante />
          <CardRestaurante />
          <CardRestaurante />
        </div>

      </div>
    </>
  );
}
