import { useRef, useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import TechOpsLogo from "@/assets/techops.png";
import { CiUser } from "react-icons/ci";
import Button from "./ui/Button";
import ListagemEndereco from "../../features/(Usuario)/components/Endereco/ListagemEndereco";
import { useAuth } from "../contexts/AuthContext";
import { TbShoppingBag } from "react-icons/tb";
import Carrinho from "../../features/(Usuario)/components/Carrinho/Index";
import { CarrinhoContext } from "../contexts/CarrinhoContext";

export default function Menu() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const idUsuario = userData?.sub;
  const role = userData?.role;

  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isCarrinhoOpen, setIsCarrinhoOpen] = useState(false);

  const { quantidadeTotal, atualizarQuantidadeTotal } =
    useContext(CarrinhoContext);

  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    atualizarQuantidadeTotal();
  }, [isCarrinhoOpen]);

  const isNotRestaurante = role !== "restaurante";

  return (
    <>
      <header
        ref={menuRef}
        className="fixed top-0 left-0 z-50 w-full bg-white py-2 shadow-md"
      >
        <div className="mx-auto flex w-4/5 max-w-screen-xl items-center justify-between px-4 sm:px-8 md:px-12 xl:px-0">
          <Link to="/">
            <img src={TechOpsLogo} alt="TechOps Logo" className="h-12 py-1" />
          </Link>

          {idUsuario && isNotRestaurante && <ListagemEndereco />}

          <div className="align-center flex gap-3">
            {!idUsuario ||
              (isNotRestaurante && (
                <>
                  <Button
                    color="plain"
                    onClick={() => navigate("/historico")}
                    className="w-40 py-2"
                  >
                    Meus Pedidos
                  </Button>
                  <div
                    className="hover:bg-brown-light-active flex w-30 cursor-pointer rounded-sm"
                    onClick={() => {
                      setIsCarrinhoOpen(true);
                      atualizarQuantidadeTotal();
                    }}
                  >
                    <div className="text-brown-normal flex items-center justify-center pl-2">
                      <TbShoppingBag className="self-center text-4xl" />
                      <p className="text-blue p-1 font-bold">
                        {quantidadeTotal}{" "}
                        <span className="font-light">Itens</span>
                      </p>
                    </div>
                  </div>
                </>
              ))}

            {idUsuario ? (
              <Button
                color="secondary"
                onClick={() => navigate("/account")}
                className="flex w-50 items-center justify-center py-2"
              >
                <CiUser size={24} /> Minha Conta
              </Button>
            ) : (
              <Button
                color="secondary"
                onClick={() => navigate("/intermediaria")}
                className="w-25 py-2"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      {isCarrinhoOpen && (
        <Carrinho
          isCarrinhoOpen={isCarrinhoOpen}
          setIsCarrinhoOpen={setIsCarrinhoOpen}
        />
      )}

      <div style={{ height: menuHeight }} />
    </>
  );
}
