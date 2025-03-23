import { IoIosArrowDown } from "react-icons/io";
import Menu from "../componentes/Menu";

export default function Home() {
	function mostrarEnderecoSalvo() {
		console.log('exibiu todos os endereço salvos')
	}

	return (
		<>
			<Menu>
				<p
					className="flex gap-2 items-center justify-between"
					onClick={mostrarEnderecoSalvo}>Endereço já salvo
					<IoIosArrowDown className="icon" />
				</p>
			</Menu>
		</>
	);
}


