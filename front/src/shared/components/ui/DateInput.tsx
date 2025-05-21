import { Calendar } from "lucide-react";
import { forwardRef } from "react";

type Props = {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
};

const DateInputWithIcon = forwardRef<HTMLInputElement, Props>(
  ({ value, onClick, placeholder }, ref) => {
    const displayValue = value && value.trim() !== "" ? value : "";

    return (
      <div
        onClick={onClick}
        className="border-gray-medium focus-within:border-brown-normal flex h-12 cursor-pointer items-center gap-2 rounded-md border bg-white px-3"
      >
        <Calendar className="h-4 w-4 text-gray-500" />
        <input
          ref={ref}
          value={displayValue}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-gray-700 outline-none"
          readOnly
        />
      </div>
    );
  },
);

export default DateInputWithIcon;
