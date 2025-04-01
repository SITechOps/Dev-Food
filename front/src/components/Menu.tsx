import { ReactNode, useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import iFoodLogo from "../assets/ifood.png";
import { CiUser } from "react-icons/ci";
import Button from "./Button";

interface MenuProps {
  children?: ReactNode;
}

export default function Menu({ children }: MenuProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      <header
        ref={menuRef}
        className="fixed top-0 left-0 z-50 w-full bg-white py-2 shadow-md"
      >
        <div className="mx-auto flex max-w-4/5 items-center justify-between">
          <Link to="/">
            <img src={iFoodLogo} alt="iFood Logo" className="h-15" />
          </Link>

          {children}

          <div className="flex gap-3">
            <Button
              color="plain"
              onClick={() => navigate("/pedido")}
              className="w-40 py-2"
            >
              Faça seu pedido
            </Button>
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
                onClick={() => navigate("/login")}
                className="w-25 py-2"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      <div style={{ height: menuHeight }} />
    </>
  );
}
