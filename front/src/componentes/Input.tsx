import { IInputProps } from "../interface/IInputs";

export default function Input({ label, id, type = "text", value, placeholder, className, onChange }: IInputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="font-medium !m-0 py-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className={`${"bg-gray-claro border-slate-300 outline-slate-400 px-4 py-2 rounded-sm w-full"} ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      ></input>
    </div>
  );
}
