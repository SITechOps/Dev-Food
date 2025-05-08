import { IModalProps } from "@/interface/IModalPadrao";
import { IoClose } from "react-icons/io5";

export default function Modal({ isOpen, onClose, children, className = "" }: IModalProps) {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed z-[9999] inset-0 flex items-center justify-center bg-black/50">
      <div className={`border-blue w-100 relative rounded-lg border-2 bg-white py-10 px-10 ${className}`}>
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
