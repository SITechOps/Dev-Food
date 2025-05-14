import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAplicar: (novaDistancia: number) => void;
  distanciaAtual: number;
  setDistanciaAtual: (nova: number) => void;
}

export default function FiltroDistanciaModal({
  isOpen,
  onClose,
  onAplicar,
  distanciaAtual,
  setDistanciaAtual,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (
      overlayRef.current &&
      modalRef.current &&
      !modalRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleClickOutside}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
      >
        <h2 className="text-blue mb-4 text-lg font-semibold">
          Filtrar por distância
        </h2>

        <label className="text-blue mb-2 block text-sm">
          Distância máxima: <strong>{distanciaAtual} km</strong>
        </label>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={distanciaAtual}
          onChange={(e) => setDistanciaAtual(Number(e.target.value))}
          className="mb-4 w-full"
        />

        <Button
          onClick={() => {
            onAplicar(distanciaAtual);
            onClose();
          }}
          className="bg-brown-normal hover:bg-brown-dark w-full text-white"
        >
          Ver resultados
        </Button>
      </div>
    </div>
  );
}
