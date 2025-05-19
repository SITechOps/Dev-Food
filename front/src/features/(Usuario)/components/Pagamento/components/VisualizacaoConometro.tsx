import { useEffect } from "react";
import { useTimer } from "react-timer-hook";
import BarraProgresso from "@/components/ui/BarraProgresso";

interface VisualizacaoConometroProps {
  onExpire: () => void;
  segundosTotais?: number;
}

export default function VisualizacaoConometro({
  onExpire,
  segundosTotais = 600,
}: VisualizacaoConometroProps) {
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + segundosTotais);

  const {
    seconds,
    minutes,
    totalSeconds,
    start,
    // restart,
  } = useTimer({
    expiryTimestamp,
    autoStart: false,
    onExpire,
  });

  useEffect(() => {
    start();
  }, []);

  const formatTime = () => {
    const min = String(minutes).padStart(2, "0");
    const sec = String(seconds).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const progresso = (totalSeconds / segundosTotais) * 100;

  return (
    <div className="my-2">
      <p className="font-bold">O tempo para você pagar acaba em:</p>
      <p className="text-brown-normal my-2 text-2xl">{formatTime()}</p>
      <BarraProgresso progress={progresso} />
    </div>
  );
}
