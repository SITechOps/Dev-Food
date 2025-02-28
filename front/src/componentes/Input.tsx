import { IInputProps } from "../interface/IInputs";

export default function Input({ label, id, type = "text", value, placeholder,  onChange  }: IInputProps) {
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor={id} className="font-medium text-stone-700 mb-1">
          {label}
        </label>
        <input
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          className="border border-slate-300 outline-slate-400 px-4 py-2 rounded-md"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        ></input>
      </div>
    </div>
  );
}
