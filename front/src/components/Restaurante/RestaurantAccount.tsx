import { useRestaurantAccount } from "../../hooks/useRestaurantAccount";
import FormComponent from "../ui/FormComponent";

export default function RestaurantForm() {
  const {
    navigate,
    formList,
    setFormList,
    restaurantFormFields,
    isEditing,
    setIsEditing,
    isLoading,
    handleLogout,
    deletarDados,
    alterarDadosRestaurante,
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
        formFields={restaurantFormFields}
        formList={formList}
        setFormList={setFormList}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isLoading={isLoading}
        navigate={navigate}
        onSubmit={alterarDadosRestaurante}
        deletarDados={deletarDados}
        handleLogout={handleLogout}
        iconStyle={iconStyle}
        baseText={baseText}
        labelStyle={labelStyle}
        title="Minha Conta"
      />
    </>
  );
}
