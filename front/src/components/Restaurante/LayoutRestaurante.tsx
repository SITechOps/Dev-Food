import MenuRestaurante from "./MenuRestaurante";

const LayoutRestaurante = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0">
        <MenuRestaurante />
      </div>

      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};
export default LayoutRestaurante;
