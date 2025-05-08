import { tv } from "tailwind-variants";
import { ComponentProps } from "react";
import { Loader2 } from "lucide-react"; // Spinner (ícone giratório)

interface IButtonProps extends ComponentProps<"button"> {
  color?: "default" | "secondary" | "outlined" | "plain";
  disabled?: boolean;
  isLoading?: boolean;
}

const buttonVariants = tv({
  base: "w-full flex items-center justify-center gap-2 cursor-pointer rounded-sm p-4 text-lg font-medium transition-all duration-200",
  variants: {
    color: {
      default: "bg-brown-normal hover:bg-brown-dark text-white",
      secondary: "bg-brown-light text-brown-normal hover:bg-brown-light-active",
      outlined:
        "border-brown-normal text-brown-normal hover:bg-brown-light-active border bg-transparent",
      plain: "text-brown-normal hover:text-brown-dark",
    },
    disabled: {
      true: "pointer-events-none cursor-not-allowed opacity-50",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

export default function Button({
  color,
  disabled,
  isLoading,
  className,
  children,
  ...props
}: IButtonProps) {
  return (
    <button
      className={buttonVariants({
        color,
        disabled: disabled || isLoading,
        className,
      })}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-5 w-5 animate-spin text-current" />}
      {isLoading ? "Processando..." : children}
    </button>
  );
}
