import { IoIosArrowDown } from "react-icons/io";

export default function ListagemEndereco() {
	function mostrarEnderecoSalvo() {
		console.log('exibiu todos os endereço salvos')
	}

	return (
		<>
			<p
				className="flex gap-2 items-center justify-between"
				onClick={mostrarEnderecoSalvo}>Endereço já salvo
				<IoIosArrowDown className="icon" />
			</p>
		</>
	);
}


