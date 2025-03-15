import { IoIosArrowDown } from "react-icons/io";

export default function Home() {
	function mostrarEnderecoSalvo() {
		console.log('exibiu todos os endereço salvos')
	}

	return (
		<div>
			<section id="sessao-endereco" className="flex flex-col items-center justify-center mt-5 w-full m-auto">
				<div className="bg-white rounded-md shadow w-[30rem] p-2 relative">

					<div className="flex gap-2 items-center justify-center m-3" onClick={mostrarEnderecoSalvo}>
						<p>Endereço já salvo </p><IoIosArrowDown className="icon" />
					</div>
				</div>
			</section>

		</div>
	);
}


