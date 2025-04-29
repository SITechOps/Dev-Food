import MenuRestaurante from "./MenuRestaurante";

const LayoutRestaurante = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-10 flex min-h-screen">
      <div className="w-64 flex-shrink-0">
        <MenuRestaurante />
      </div>

      <main className="ml-4 flex-1">{children}</main>
    </div>
  );
};
export default LayoutRestaurante;
