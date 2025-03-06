import { useState } from "react";
import Button from "../../componentes/Button";
import Input from "../../componentes/Input";
import { useNavigate } from "react-router-dom";

export default function CadastroEndereco() {
	const [pesquisa, setPesquisa] = useState("");
	const navigate = useNavigate();


	const handleSearch = (e: any) => {
		e.preventDefault()
		console.log("Realizando pesquisa sobre:", pesquisa);
		navigate("/modal-endereco");

	};
	return (
		<section className="flex flex-col items-center justify-center min-h-screen w-full m-auto">
			<h1 className="text-3xl font-bold text-center mb-[3rem]">Faça compras no iFood</h1>
			<form className="bg-white rounded-md shadow w-[25rem] p-6" >
				<legend className="text-center !mb-[2rem]">
				Entregamos tudo o que precisa na porta da sua casa, informe seu endereço
				</legend>
				<div className="">
					<Input type="text" value={pesquisa} placeholder={"Digite o endereço..."} onChange={setPesquisa} className="!p-4 mb-6" />

					<Button onClick={handleSearch}>Buscar</Button>
				</div>

			</form>
		</section>

	)
}