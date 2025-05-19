import { IModalProps } from "@/shared/interfaces/IModalPadrao";
import { IoClose } from "react-icons/io5";

export default function Modal({
  isOpen,
  onClose,
  children,
  className = "",
}: IModalProps) {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div
        className={`border-blue relative w-100 rounded-lg border-2 bg-white px-10 py-10 ${className}`}
      >
        <IoClose
          className="icon absolute top-3 right-4"
          size={26}
          onClick={onClose}
        />
        {children}
      </div>
    </div>
  );
}
