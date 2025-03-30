import Menu from "../components/Menu";
import ListagemEndereco from "../components/ListagemEndereco";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("userLogado") || "null");
const idUsuario = getUserId();

function getUserId() {
  if (user && user.id) {
    return user.id;
  }

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch (error) {
      console.error("Erro ao acessar a conta:", error);
      return null;
    }
  }
  return null;
}

export default function Home() {
  return (
    <>
      <Menu>
        <ListagemEndereco idUsuario={idUsuario} />
      </Menu>
    </>
  );
}
