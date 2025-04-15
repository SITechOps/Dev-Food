import Button from "./Button";
import { useRestaurantAccount } from "../hooks/useRestaurantAccount";
import FormComponent from "./FormComponent";

export default function Financeiro() {
  const {
    navigate,
    formListBancario,
    setFormListBancario,
    restaurantBankFields,
    isEditing,
    setIsEditing,
    idRestaurante,
    alterarDadosBancarios,
  } = useRestaurantAccount();

  const baseText = "text-lg mb-1";
  const labelStyle = {
    color: "var(--color-brown-dark)",
  };

  const iconStyle =
    "bg-brown-light hover:bg-brown-light-active flex h-10 w-10 cursor-pointer items-center justify-center rounded-full";

  if (!idRestaurante) {
    return (
      <section className="flex h-screen flex-col items-center justify-center">
        <h2 className="font-bold">Acesso negado</h2>
        <p className="mt-2">Faça login para acessar sua conta!</p>
        <Button onClick={() => navigate("/auth")} className="mt-5 w-100">
          Fazer Login
        </Button>
      </section>
    );
  }

  return (
    <>
      <FormComponent
        formFields={restaurantBankFields}
        formList={formListBancario}
        setFormList={setFormListBancario}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        navigate={navigate}
        onSubmit={alterarDadosBancarios}
        iconStyle={iconStyle}
        baseText={baseText}
        labelStyle={labelStyle}
        title="Dados Bancários"
      />
    </>
  );
}
