import { useState } from "react";
import Button from "../../componentes/Button";
import Input from "../../componentes/Input";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";


export default function CadastroEndereco() {
    const [pesquisa, setPesquisa] = useState("");
    const [enderecos, setEnderecos] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const resultados = [
            "Rua das Flores, 547",
            "Rua das Flores, 456",
            "Rua das Flores, 789"
        ];
        setEnderecos(resultados);
    };

	const handleSelectAddress = (endereco: string) => {
        navigate("/compl-endereco", { state: { enderecoSelecionado: endereco } });
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen w-full m-auto">
            <h1 className="font-bold text-center mb-[3rem]">Faça compras no iFood</h1>
            <form className="bg-white rounded-md shadow w-[25rem] p-6 relative" onSubmit={handleSearch}>
                <legend className="text-center !mb-[2rem]">
                    Entregamos tudo o que precisa na porta da sua casa, informe seu endereço
                </legend>
                <div className="relative">
                <div className="grid grid-cols-[auto_3rem] gap-2">
                        <Input
                            type="text"
                            value={pesquisa}
                            placeholder="Digite o endereço..."
                            onChange={setPesquisa}
                            className="!p-4 w-full !m-0 row-span-2"
                        />
                        <Button 
                            type="submit" 
                            className="!w-[3rem] flex justify-center items-center"
                            disabled={!pesquisa}
                        > <FiSearch className={`icon ${!pesquisa ? "!text-blue" : "!text-brown-ligth"}`} /></Button>
                    </div>
                    {enderecos.length > 0 && (
                        <ul className="absolute left-0 right-0 bg-white border border-brown-ligth-active rounded-md shadow-md z-10">
                            {enderecos.map((endereco, index) => (
                                <li 
                                    key={index} 
                                    className="p-2 cursor-pointer hover:bg-brown-ligth"
                                    onClick={() => handleSelectAddress(endereco)}
                                >
                                    {endereco}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </form>
        </section>
    );
}
