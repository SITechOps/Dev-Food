import { useState } from "react";

const statuses = [
  "Aguardando a confirmação do restaurante.",
  "Pedido aceito pelo restaurante.",
  "O pedido está sendo preparado e logo sairá para entrega.",
  "O pedido saiu para entrega.",
  "O pedido foi entregue.",
];

export default function OrderStatusTracker() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    if (currentStep < statuses.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl border bg-white p-6 shadow-md">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Acompanhamento do pedido
      </h2>

      <div className="mb-4 flex items-center justify-between">
        {statuses.map((_, index) => (
          <div
            key={index}
            className={`mx-1 h-1 flex-1 rounded-full ${
              index <= currentStep ? "bg-green" : "bg-gray-medium"
            }`}
          />
        ))}
      </div>

      <p className="text-blue mb-6 text-center">{statuses[currentStep]}</p>

      <button
        onClick={handleNextStep}
        disabled={currentStep === statuses.length - 1}
        className="bg-brown-normal hover:bg-brown-light-active disabled:bg-gray-medium w-full rounded-lg py-2 font-semibold text-white transition"
      >
        Próxima etapa
      </button>
    </div>
  );
}
