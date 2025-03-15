import { useEffect, useState } from "react";
import Button from "../../componentes/Button";
import Input from "../../componentes/Input";
import { FaAngleLeft } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

export default function ComplementoEndereco() {
	const location = useLocation();
	const navigate = useNavigate();
	const [endereco, setEndereco] = useState("");
	const [numero, setNumero] = useState("");
	const [complemento, setComplemento] = useState("");

	useEffect(() => {
		if (location.state?.enderecoSelecionado) {
			setEndereco(location.state.enderecoSelecionado);
		}
	}, [location.state]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		navigate("/home");
	};
	return (
		<section className="flex flex-col items-center justify-center min-h-screen w-full m-auto">
			<h1 className="font-bold text-center mb-[3rem]">Faça compras no iFood</h1>
			<form className="bg-white rounded-md shadow w-[25rem] p-6" onSubmit={handleSearch}>
				<div className="flex gap-8">
					<button onClick={() => navigate(-1)} className="self-start mb-5">
						<FaAngleLeft className="icon" />
					</button>
					<legend className="text-center !mb-[2rem]">
						Insira mais informações sobre o endereço
					</legend>
				</div>

				<div className="relative w-full mb-3">
					<Button
						variant="plain"
						onClick={() => navigate(-1)}
						className="!p-0 absolute top-5 left-33 mb-1"
					>
						Alterar
					</Button>

					<Input
						type="text"
						value={endereco}
						onChange={setEndereco}
						className="!p-4"
						disabled
					/>
				</div>

				<Input type="text" value={numero} placeholder="123" onChange={setNumero} className="!p-4 mb-3" />
				<Input type="text" value={complemento} placeholder="Complemento..." onChange={setComplemento} className="!p-4 mb-3" />
				<Button type="submit" disabled={!endereco || !numero || !complemento}>Confirmar</Button>

			</form>
		</section >
	)
}