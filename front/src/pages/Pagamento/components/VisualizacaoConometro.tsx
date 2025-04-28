import BarraProgresso from "@/components/ui/BarraProgresso";
import { usePixComponent } from "@/hooks/FormasPagamento/usePix";


export default function VisualizacaoConometro() {
	const {
		time,
		conometro,
		formatTime,
	} = usePixComponent();

	return (
		<div className='my-2'>
			<p className="font-bold">O tempo para você pagar acaba em:</p>
			<p className="text-2xl my-2 text-brown-normal">{formatTime(conometro.timeLeft)}</p>
			<BarraProgresso progress={time} />
		</div>
	);
}
