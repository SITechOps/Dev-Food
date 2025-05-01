import HistoricoDePedido from "@/components/Usuario/HistoricoDePedido";

export default function MeusPedidos() {
  return (
    <div className="mt-[5rem]">
      <h1 className="mb-6 text-2xl font-bold">Meus pedidos</h1>

      <HistoricoDePedido tipo="meuPedido" />

      <h1 className="mb-6 text-2xl font-bold">Histórico</h1>

      <HistoricoDePedido tipo="historico" />
    </div>
  );
}
