import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 10) + 5;
        return next >= 95 ? 95 : next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-red-100 to-red-200 px-4 text-red-900">
      <h1 className="mb-6 animate-pulse text-3xl font-bold">
        Carregando seus pedidos...
      </h1>

      <div className="h-6 w-full max-w-md overflow-hidden rounded-full bg-white shadow-inner">
        <div
          className="h-full transition-all duration-200 ease-in-out"
          style={{
            width: `${progress}%`,
            backgroundColor: "#f87171", // mesma cor dos botões
          }}
        />
      </div>

      <p className="mt-4 text-lg font-medium">{progress}%</p>

      <p className="mt-2 text-sm text-red-800 italic">
        Aguarde um momento enquanto buscamos seus dados.
      </p>
    </div>
  );
}
