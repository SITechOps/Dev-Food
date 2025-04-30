import { useState } from "react";
import MenuRestaurante from "./MenuRestaurante";

const LayoutRestaurante = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="mt-10 flex min-h-screen">
      <div
        className={`fixed top-0 left-0 h-full w-64 flex-shrink-0 bg-gray-800 text-white transition-all duration-300 lg:relative ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <MenuRestaurante />
      </div>

      <button
        onClick={toggleMenu}
        className="absolute top-5 left-5 z-10 rounded bg-blue-500 p-2 text-white lg:hidden"
      >
        ☰
      </button>

      <main
        className={`ml-4 flex-1 transition-all duration-300 lg:ml-4 ${
          isMenuOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default LayoutRestaurante;
