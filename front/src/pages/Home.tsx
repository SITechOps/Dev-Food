import { IoIosArrowDown } from "react-icons/io";
import Menu from "../componentes/Menu";
import Buttons from "../componentes/Button";

export default function Home() {
	function mostrarEnderecoSalvo() {
		console.log('exibiu todos os endereço salvos')
	}

	return (
		<>
			<Menu>
				<section id="sessao-endereco" className="flex flex-col items-center justify-center">
					<p
						className="flex gap-2 items-center justify-center"
						onClick={mostrarEnderecoSalvo}>Endereço já salvo
						<IoIosArrowDown className="icon" />
					</p>
				</section>
			</Menu>
		</>
	);
}


