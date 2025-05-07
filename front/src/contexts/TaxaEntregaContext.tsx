import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TaxaEntregaContextType {
	taxaEntregaSelecionada: number;
	setTaxaEntregaSelecionada: React.Dispatch<React.SetStateAction<number>>;
	duracaoPadrao: string | null;
	duracaoRapida: string | null;
	taxaEntregaPadrao: number;
	taxaEntregaRapida: number;
	handleSelecionado: (value: "padrão" | "rápida") => void;
	tipoEntregaSelecionada: "padrão" | "rápida"; 
	setTipoEntregaSelecionada: React.Dispatch<React.SetStateAction<"padrão" | "rápida">>; 
}

const TaxaEntregaContext = createContext<TaxaEntregaContextType | undefined>(undefined);

export const TaxaEntregaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [taxaEntregaSelecionada, setTaxaEntregaSelecionada] = useState(0.0);
	const [duracaoPadrao, setDuracaoPadrao] = useState<string | null>(null);
	const [duracaoRapida, setDuracaoRapida] = useState<string | null>(null);
	const [taxaEntregaPadrao, setTaxaEntregaPadrao] = useState(0.0);
	const [taxaEntregaRapida, setTaxaEntregaRapida] = useState(0.0);
	const [selecionado, setSelecionado] = useState<"padrão" | "rápida">("padrão");

	useEffect(() => {
		setTaxaEntregaSelecionada(taxaEntregaPadrao);
	}, [taxaEntregaPadrao]);

	useEffect(() => {
		const storedFrete = JSON.parse(localStorage.getItem("restauranteSelecionado") || "null");
		if (storedFrete) {
			setTaxaEntregaPadrao(storedFrete.taxaEntrega || 0);
			setTaxaEntregaRapida(storedFrete.taxaEntrega * 1.15 || 0);
			setDuracaoPadrao(
				storedFrete.duration
					? `${Math.floor(storedFrete.duration / 60)}-${Math.floor(storedFrete.duration / 60) + 10} min`
					: null,
			);
			setDuracaoRapida(
				storedFrete.duration
					? `${Math.floor((storedFrete.duration / 60) * 0.8)}-${Math.floor((storedFrete.duration / 60) * 0.8) + 10} min`
					: null,
			);
		}
		handleSelecionado("padrão");
	}, []);

	const handleSelecionado = (value: "padrão" | "rápida") => {
		setSelecionado(value);
		if (value === "padrão") {
			setTaxaEntregaSelecionada(taxaEntregaPadrao);
		} else if (value === "rápida") {
			setTaxaEntregaSelecionada(taxaEntregaRapida);
		}
	};

	return (
		<TaxaEntregaContext.Provider
			value={{
				taxaEntregaSelecionada,
				setTaxaEntregaSelecionada,
				duracaoPadrao,
				duracaoRapida,
				taxaEntregaPadrao,
				taxaEntregaRapida,
				handleSelecionado,
				tipoEntregaSelecionada: selecionado, 
				setTipoEntregaSelecionada: setSelecionado, 
			}}
		>
			{children}
		</TaxaEntregaContext.Provider>
	);
};

export const useTaxaEntrega = (): TaxaEntregaContextType => {
	const context = useContext(TaxaEntregaContext);
	if (!context) {
		throw new Error('useTaxaEntrega deve ser usado dentro do TaxaEntregaProvider');
	}
	return context;
};
