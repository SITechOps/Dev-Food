import { ClipboardList, Home, User, LogOut, MapPin } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const MenuRestaurante = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  type MenuItem = {
    name: string;
    icon: React.ReactNode;
    link: string;
    badge?: number;
    action?: () => void;
  };

  const menuItems: MenuItem[] = [
    { name: "Início", icon: <Home size={20} />, link: "/" },
    { name: "Minha Conta", icon: <User size={20} />, link: "/account" },
    { name: "Endereço", icon: <MapPin size={20} />, link: "/c-endereco" },
    {
      name: "Cardápios",
      icon: <ClipboardList size={20} />,
      link: "/cardapios",
    },
    {
      name: "Sair",
      icon: <LogOut size={20} />,
      link: "",
      action: handleLogout,
    },
  ];

  return (
    <>
      <button
        className="bg-brown-dark fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded text-white lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fechar Menu" : "Abrir Menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      <div
        className={`border-t-gray-light border-r-gray-light z-10 mt-14 w-64 border-t border-r bg-white p-4 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:block lg:translate-x-0`}
      >
        <ul className="space-y-4">
          {menuItems.map((item, i) => (
            <li
              key={i}
              className="group text-blue hover:bg-brown-light-active hover:text-brown-dark flex cursor-pointer items-center justify-between gap-2 rounded-md p-3 transition-colors"
            >
              {item.action ? (
                <button
                  onClick={item.action}
                  className="flex w-full items-center gap-3"
                >
                  {item.icon}
                  <span className={item.name === "Sair" ? "text-brown-light" : ""}>
                    {item.name}
                  </span>
                </button>
              ) : (
                <Link to={item.link} className="flex w-full items-center gap-3">
                  {item.icon}
                  <span className={item.name === "Sair" ? "text-brown-light" : ""}>
                    {item.name}
                  </span>
                </Link>
              )}
              {item.badge && (
                <span className="bg-brown-normal text-brown-normal rounded-full px-2 py-0.5 text-xs">
                  {item.badge}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MenuRestaurante;
