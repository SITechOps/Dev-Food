import { IIconActionProps } from "@/interface/IIconAtction";
import { FaAngleLeft } from "react-icons/fa";

export default function IconAction({ className, onClick, children }: IIconActionProps) {

	return (
		<>
			<button
				onClick={onClick}
				className={`self-start flex ${className}`}
			>
				<FaAngleLeft className="icon" />
				{children}
			</button>
		</>
	)

}