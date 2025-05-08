import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export interface IInputProps extends Omit<ComponentProps<"input">, "onChange"> {
  textLabel?: string;
  onChange?: (value: string) => void;
}

export default function Input({ textLabel, onChange, ...props }: IInputProps) {
  return (
    <div>
      {textLabel && (
        <label htmlFor={props.id} className="font-medium">
          {textLabel}
        </label>
      )}
      <input
        {...props}
        className={twMerge("input", props.className)}
        onChange={(e) => onChange?.(e.target.value)}
      ></input>
    </div>
  );
}
