import { useState } from "react";
import Button from "../../componentes/Button";
import Input from "../../componentes/Input";
import { useNavigate } from "react-router-dom";

export default function CadastroEndereco() {
    const [pesquisa, setPesquisa] = useState("");
    const [enderecos, setEnderecos] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulando busca de endereços
        const resultados = [
            "Rua das Flores, 547",
            "Rua das Flores, 456",
            "Rua das Flores, 789"
        ];
        setEnderecos(resultados);
    };

	const handleSelectAddress = (endereco: string) => {
        navigate("/complemento-endereco", { state: { enderecoSelecionado: endereco } });
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen w-full m-auto">
            <h1 className="font-bold text-center mb-[3rem]">Faça compras no iFood</h1>
            <form className="bg-white rounded-md shadow w-[25rem] p-6 relative" onSubmit={handleSearch}>
                <legend className="text-center !mb-[2rem]">
                    Entregamos tudo o que precisa na porta da sua casa, informe seu endereço
                </legend>
                <div className="relative">
                    <Input 
                        type="text" 
                        value={pesquisa} 
                        placeholder="Digite o endereço..." 
                        onChange={setPesquisa} 
                        className="!p-4 w-full" 
                    />
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
                <Button type="submit" className="mt-6">Buscar</Button>
            </form>
        </section>
    );
}
