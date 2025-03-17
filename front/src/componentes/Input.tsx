import { IInputProps } from "../interface/IInputs";

export default function Input({
  label,
  id,
  type = "text",
  value,
  placeholder,
  className,
  disabled,
  onChange,
}: IInputProps) {
  return (
    <div className="">
      <label htmlFor={id} className="font-Dosis font-medium !m-0 py-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className={`${"bg-gray-claro border-slate-300 outline-slate-400 px-4 py-2 rounded-sm w-full"} ${className}`}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      ></input>
    </div>
  );
}
