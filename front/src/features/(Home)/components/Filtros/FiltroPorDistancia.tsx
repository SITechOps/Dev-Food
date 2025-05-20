import { useEffect } from "react";
import Button from "@/shared/components/ui/Button";

interface FiltroDistanciaModalProps {
  aberto: boolean;
  onClose: () => void;
  distancia: number;
  onChange: (valor: number) => void;
  onAplicar: () => void;
}

export default function FiltroDistanciaModal({
  aberto,
  onClose,
  distancia,
  onChange,
  onAplicar,
}: FiltroDistanciaModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (aberto) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [aberto, onClose]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="text-gray-medium hover:text-blue absolute top-4 right-4"
        >
          ✕
        </button>

        <h2 className="text-brown-normal mb-4 text-lg font-semibold">
          Selecione a distância
        </h2>

        <div className="flex flex-col gap-4">
          <label htmlFor="range" className="text-gray-medium text-sm">
            Distância:{" "}
            <span className="text-blue font-medium">{distancia} km</span>
          </label>
          <input
            id="range"
            type="range"
            min={1}
            max={30}
            step={1}
            value={distancia}
            onChange={(e) => onChange(Number(e.target.value))}
            className="accent-brown-normal w-full"
          />
          <Button
            onClick={() => {
              onAplicar();
              onClose();
            }}
            className="mt-2 px-4 py-2"
          >
            Ver resultados
          </Button>
        </div>
      </div>
    </div>
  );
}
