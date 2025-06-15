import { IIconActionProps } from "@/shared/interfaces/IIconAction";
import { FaAngleLeft } from "react-icons/fa";

export default function IconAction({
  className,
  onClick,
  children,
}: IIconActionProps) {
  return (
    <>
      <button onClick={onClick} className={`flex self-start ${className}`}>
        <FaAngleLeft className="icon" />
        {children}
      </button>
    </>
  );
}
