import Menu from "../components/Menu";
import ListagemEndereco from "../components/ListagemEndereco";
import { decodeToken } from "../utils/decodeToken";

export default function Home() {
  const token = localStorage.getItem("token");
  const idUsuario = token ? decodeToken(token)?.sub : undefined;

  return (
    <>
      <Menu>
        <ListagemEndereco idUsuario={idUsuario} />
      </Menu>
    </>
  );
}
