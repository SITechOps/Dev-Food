import { IButtonPropsColors, IButtonPropsVariant } from "../interface/IButton";

export default function Button({
  children,
  color = "default",
  variant = "filled",
  img = false,
  className =  "",
  onClick,
}: {
  children: React.ReactNode;
  color?: IButtonPropsColors;
  variant?: IButtonPropsVariant;
  img?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const defaultButtonClasses =
    "font-Dosis font-medium p-4 rounded-sm w-full";

  const variants = {
    filled: {
      default: "bg-brown-normal text-white hover:bg-brown-dark",
      secundary: "bg-brown-ligth text-brown-normal hover:bg-brown-ligth-active",
      disable: "bg-gray-claro text-gray-medio",
    },
    outlined: {
      default:
        "bg-brown-normal text-brown-normal hover:bg-brown-ligth-active border boder-transparent bg-transparent",
      secundary: "",
      disable:
        "bg-gray-claro text-gray-medio border boder-transparent bg-transparent",
    },
    plain: {
      default: "text-brown-normal hover:text-brown-dark w-6 p-2",
      secundary: "",
      disable: "",
    },
    filledIcon: {
      default: "",
      secundary:
        "bg-brown-ligth text-brown-normal hover:bg-brown-ligth-active flex justify-center",
      disable: "",
    },
  };
  return (
    <button
    className={`${defaultButtonClasses} ${variants[variant][color]} ${className}`} 
    onClick={onClick}    
    >
      {img ? <img src="img/google.svg" alt="" className="w-6 pr-2" /> : null}
      {children}
    </button>
  );
}
