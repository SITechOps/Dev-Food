import { IButtonPropsColors, IButtonPropsVariant } from "../interface/IButton";

export default function Button({
  children,
  color = "default",
  variant = "filled",
  img = false,
  className = "",
  type,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  color?: IButtonPropsColors;
  variant?: IButtonPropsVariant;
  img?: boolean;
  className?: string;
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement> | any) => void;
}) {
  const defaultButtonClasses = "font-Dosis font-medium p-4 rounded-sm w-full cursor-pointer";

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
      default: "text-brown-normal hover:text-brown-dark",
      secundary: "",
      disable: "",
    },
    filledIcon: {
      default: "",
      secundary:
        "bg-brown-ligth text-brown-normal hover:bg-brown-ligth-active flex justify-center items-center flex gap-4",
      disable: "",
    },
  };
  return (
    <button
      className={`${defaultButtonClasses} ${variants[variant][disabled ? "disable" : color]} ${className}`}
      onClick={disabled ? undefined : onClick} // 🔹 Impede cliques se desabilitado
      type={type}
      disabled={disabled} // 🔹 Aplica o atributo disabled
    >
      {img ? <img src="img/google.svg" alt="" className="size-4" /> : null}
      {children}
    </button>
  );
}
