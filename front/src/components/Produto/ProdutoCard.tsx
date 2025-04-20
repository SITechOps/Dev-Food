const ProdutoCard = ({ produto }) => {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-md">
      <img
        src={
          produto.imageUrl ||
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt={produto.nome}
        className="h-32 w-full rounded object-cover"
      />
      <h3 className="mt-2 font-semibold">{produto.nome}</h3>
      <p className="text-sm text-gray-600">{produto.descricao}</p>
      <p className="mt-1 text-sm font-medium">
        R$ {parseFloat(produto.valor_unitario).toFixed(2)}
      </p>
    </div>
  );
};
export default ProdutoCard;
