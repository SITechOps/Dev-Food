import { useRestaurantAccount } from "../../hooks/useRestaurantAccount";
import FormComponent from "../ui/FormComponent";

export default function EnderecoModal() {
  const {
    navigate,
    formListEndereco,
    setFormListEndereco,
    restaurantEnderecoFields,
    isEditing,
    setIsEditing,
    isLoading,
    alterarEnderecoRestaurante,
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
        formFields={restaurantEnderecoFields}
        formList={formListEndereco}
        setFormList={setFormListEndereco}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isLoading={isLoading}
        navigate={navigate}
        onSubmit={alterarEnderecoRestaurante}
        iconStyle={iconStyle}
        baseText={baseText}
        labelStyle={labelStyle}
        title="Endereço do Restaurante"
      />
    </>
  );
}
