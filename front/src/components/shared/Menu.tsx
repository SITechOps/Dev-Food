import { useRef, useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import iFoodLogo from "../../assets/ifood.png";
import { CiUser } from "react-icons/ci";
import Button from "../ui/Button";
import ListagemEndereco from "../Endereco/ListagemEndereco";
import { useAuth } from "../../contexts/AuthContext";
import { TbShoppingBag } from "react-icons/tb";
import Carrinho from "../Carrinho/Index";
import { CarrinhoContext } from "../../contexts/CarrinhoContext";

export default function Menu() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const idUsuario = userData?.sub;
  const token = localStorage.getItem("token");
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isCarrinhoOpen, setIsCarrinhoOpen] = useState(false);
  const { quantidadeTotal, atualizarQuantidadeTotal } = useContext(CarrinhoContext);

  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    atualizarQuantidadeTotal();
  }, [isCarrinhoOpen]); 

  return (
    <>
      <header
        ref={menuRef}
        className="fixed top-0 left-0 z-50 w-full bg-white py-2 shadow-md"
      >
        <div className="mx-auto flex max-w-4/5 items-center justify-between">
          <Link to="/">
            <img src={iFoodLogo} alt="iFood Logo" className="h-12 py-1" />
          </Link>

          {idUsuario ? (
            <>
              <ListagemEndereco />
            </>
          ) : null}

          <div className="flex gap-3 align-center">
            {idUsuario ? (
              <Button
                color="plain"
                onClick={() => navigate("/pedido")}
                className="w-40 py-2"
              >
                Faça seu pedido
              </Button>
            ) : null}
            {token ? (
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

            <div className="relative w-fit cursor-pointer" onClick={() => {setIsCarrinhoOpen(true); atualizarQuantidadeTotal() }}>
              <TbShoppingBag className="text-brown-normal hover:text-brown-dark text-4xl self-center" />
              <div className="bg-brown-light-active text-brown-normal font-bold rounded-full w-5 h-5 flex items-center justify-center absolute -top-2 -right-2">                  
                  {quantidadeTotal}
              </div>
            </div>
          </div>
        </div>
      </header>\
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
