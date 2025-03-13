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
        console.log("Endereço confirmado:", endereco);
    };
	return (
		<section className="flex flex-col items-center justify-center min-h-screen w-full m-auto">
			<h1 className="font-bold text-center mb-[3rem]">Faça compras no iFood</h1>
			<form className="bg-white rounded-md shadow w-[25rem] p-6" onSubmit={handleSearch}>
				<button onClick={() => navigate(-1)} className="self-start mb-5">
					<FaAngleLeft className="icon" />
				</button>
				<legend className="text-center !mb-[2rem]">
					Insira mais informações sobre o endereço
				</legend>
				<div className="">
					<Input type="text" value={endereco} onChange={setEndereco} className="!p-4 mb-6" />
					<Input type="text" value={numero} placeholder="123" onChange={setNumero} className="!p-4 mb-6" />
					<Input type="text" value={complemento} placeholder="Complemento..." onChange={setComplemento} className="!p-4 mb-6" />
					<Button type="submit">Confirmar</Button>
				</div>

			</form>
		</section>
	)
}