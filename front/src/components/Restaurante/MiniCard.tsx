export default function MiniRestauranteCard({
  restaurante,
}: {
  restaurante: any;
}) {
  return (
    <div className="flex items-center gap-4 rounded-md border bg-white p-2 shadow-sm">
      <img
        src={
          restaurante.logoUrl ||
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt={restaurante.nome}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div>
        <h4 className="font-semibold">{restaurante.nome}</h4>
        <p className="text-sm text-gray-500">{restaurante.especialidade}</p>
      </div>
    </div>
  );
}
