import { useRestaurantAccount } from "../../hooks/useRestaurantAccount";
import FormComponent from "../ui/FormComponent";

export default function Financeiro() {
  const {
    navigate,
    formListBancario,
    setFormListBancario,
    restaurantBankFields,
    isEditing,
    isLoading,
    setIsEditing,
    alterarDadosBancarios,
  } = useRestaurantAccount();

  const baseText = "text-lg mb-1";
  const labelStyle = {
    color: "var(--color-brown-dark)",
  };

  const iconStyle =
    "bg-brown-light hover:bg-brown-light-active flex h-10 w-10 cursor-pointer items-center justify-center rounded-full";

  return (
    <>
      <FormComponent
        formFields={restaurantBankFields}
        formList={formListBancario}
        setFormList={setFormListBancario}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isLoading={isLoading}
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
