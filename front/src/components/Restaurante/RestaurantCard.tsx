const RestauranteCard = ({ restaurante }) => {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-md">
      <img
        src={
          restaurante.logoUrl ||
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt={restaurante.nome}
        className="h-32 w-full rounded object-cover"
      />
      <h3 className="mt-2 font-semibold">{restaurante.nome}</h3>
      <p className="text-sm text-gray-600">
        {restaurante.tipo_cozinha} • {restaurante.distancia ?? "??"} km
      </p>
      <p className="text-sm text-gray-500">
        35-45 min •{" "}
        <span className="text-green-500">
          {restaurante.taxaEntrega === 0 || "undefined"
            ? "Grátis"
            : `R$ ${restaurante.taxaEntrega?.toFixed(2)}`}
        </span>
      </p>
    </div>
  );
};
export default RestauranteCard;
