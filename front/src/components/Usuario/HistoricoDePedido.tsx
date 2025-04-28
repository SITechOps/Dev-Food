export default function HistoricoDePedido() {
  return (
    <div className="flex h-[11.25rem] w-[34.375rem] flex-col justify-between rounded-lg border border-[#A9A9A9] bg-white p-4">
      <div className="flex items-center gap-3">
        <img src="" alt="Logo McDonald's" className="h-10 w-10 rounded-full" />
        <div className="flex flex-col">
          <span className="font-semibold">McDonald's - Botafogo (sbo)</span>
          <span className="text-sm text-gray-500">
            Pedido concluído • Nº 3999
          </span>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-700">
        1 McOferta Média Clássica + McFlurry Kitkat Chocolate com Coco
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button className="font-semibold text-red-500">Ajuda</button>
        <button className="rounded-full bg-red-500 px-4 py-2 text-sm text-white">
          Acompanhar pedido
        </button>
      </div>
    </div>
  );
}
