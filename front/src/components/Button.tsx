import { tv } from "tailwind-variants";
import { ComponentProps } from "react";

const button = tv({
  base: "font-medium text-lg p-4 rounded-sm w-full cursor-pointer transition-all duration-200",
  variants: {
    color: {
      default: "bg-brown-normal text-white hover:bg-brown-dark",
      secondary: "bg-brown-ligth text-brown-normal hover:bg-brown-ligth-active",
      outlined:
        "border border-brown-normal text-brown-normal hover:bg-brown-light-active bg-transparent",
      plain: "text-brown-normal hover:text-brown-dark",
      defaultImg:
        "bg-brown-ligth text-brown-normal hover:bg-brown-ligth-active ",
    },
    disabled: {
      true: "opacity-50 cursor-not-allowed pointer-events-none",
      false: "",
    },
  },
});

interface IButtonProps extends ComponentProps<"button"> {
  color?: "default" | "secondary" | "outlined" | "plain";
}

export default function Button({
  color = "default",
  className,
  disabled,
  ...props
}: IButtonProps) {
  return (
    <button className={button({ color, disabled, className })} {...props}>
      {props.children}
    </button>
  );
}
