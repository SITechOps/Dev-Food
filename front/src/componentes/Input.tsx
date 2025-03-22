import { IInputProps } from "../interface/IInputs";
import { twMerge } from 'tailwind-merge'


export default function Input({
  label,
  id,
  type = "text",
  ref,
  value,
  placeholder,
  className,
  disabled,
  onChange,
}: IInputProps) {

  const baseCss = "bg-gray-claro border-slate-300 outline-slate-400 px-4 py-2 mt-1 rounded-sm w-full"
  return (
    <div className="">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <input
        type={type}
        id={id}
        ref={ref}
        name={id}
        placeholder={placeholder}
        className={twMerge(baseCss, className)}
        value={value}
        disabled={disabled}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      ></input>
    </div>
  );
}
