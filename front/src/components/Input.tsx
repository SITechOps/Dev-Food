import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export interface IInputProps extends Omit<ComponentProps<"input">, "onChange"> {
  textLabel?: string;
  onChange?: (value: string) => void;
}

export default function Input({ textLabel, onChange, ...props }: IInputProps) {
  const baseCss =
    "bg-gray-claro mt-1 w-full rounded-sm border-slate-300 px-4 py-3 outline-slate-400 [&::-ms-reveal]:hidden";
  return (
    <div>
      <label htmlFor={props.id} className="font-medium">
        {textLabel}
      </label>
      <input
        {...props}
        className={twMerge(baseCss, props.className)}
        onChange={(e) => onChange?.(e.target.value)}
      ></input>
    </div>
  );
}
