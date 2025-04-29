import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  User,
  LogOut,
  MapPin,
  DollarSign,
  Package,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { api } from "../../connection/axios";

const MenuRestaurante = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [totalPedidos, setTotalPedidos] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const idRestaurante = userData?.sub;

  const fetchTotalPedidos = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/pedidos/restaurante/${idRestaurante}`);
      const pedidos = response.data.pedidos || [];
      setTotalPedidos(pedidos.length);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalPedidos();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  type MenuItem = {
    name: string;
    icon: React.ReactNode;
    link: string;
    badge?: number | React.ReactNode;
    action?: () => void;
  };

  const menuItems: MenuItem[] = [
    { name: "Minha Conta", icon: <User size={20} />, link: "/account" },
    {
      name: "Pedidos",
      icon: <Package size={20} />,
      link: "/pedidos",
      badge: !loading ? totalPedidos : null,
    },
    {
      name: "Endereço",
      icon: <MapPin size={20} />,
      link: "/alterar-endereco",
    },
    {
      name: "Cardápios",
      icon: <ClipboardList size={20} />,
      link: "/cardapios",
    },
    { name: "Financeiro", icon: <DollarSign size={20} />, link: "/financeiro" },
    {
      name: "Sair",
      icon: <LogOut size={20} className="text-brown-dark" />,
      link: "",
      action: handleLogout,
    },
  ];

  return (
    <>
      <button
        className="bg-brown-dark fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded text-white lg:hidden"
        onClick={() => {
          setIsOpen(!isOpen);
          (document.activeElement as HTMLElement)?.blur();
        }}
        aria-label={isOpen ? "Fechar Menu" : "Abrir Menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      <div
        className={`border-t-gray-light border-r-gray-light z-10 w-64 border-t border-r bg-white p-4 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:block lg:translate-x-0`}
      >
        <ul className="space-y-4">
          {menuItems.map((item, i) => {
            const isActive = location.pathname === item.link;

            return (
              <li
                key={i}
                className={`group flex cursor-pointer items-center justify-between gap-2 rounded-md p-3 transition-colors ${isActive ? "bg-brown-light-active text-brown-dark" : "text-blue hover:bg-brown-light-active hover:text-brown-dark"}`}
                onClick={() => setIsOpen(false)}
              >
                {item.action ? (
                  <button
                    onClick={item.action}
                    className="flex w-full cursor-pointer items-center gap-3"
                  >
                    {item.icon}
                    <span
                      className={item.name === "Sair" ? "text-brown-dark" : ""}
                    >
                      {item.name}
                    </span>
                  </button>
                ) : (
                  <Link
                    to={item.link}
                    className="flex w-full items-center gap-3"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                )}
                {item.badge && (
                  <span className="bg-brown-normal flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                    {item.badge}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default MenuRestaurante;
