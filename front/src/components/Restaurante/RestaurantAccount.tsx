import { useRestaurantAccount } from "../../hooks/useRestaurantAccount";
import FormComponent from "../ui/FormComponent";
import ImageUploadButton from "../ui/ImageUploadButton";
import { ImagemDeEntidade } from "../ui/ImagemEntidade";

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
    setImageFile,
    imageFile,
    handleEditSubmit,
    restaurantLogo,
  } = useRestaurantAccount();

  const baseText = "text-lg mb-1";
  const labelStyle = {
    color: "var(--color-brown-dark)",
  };

  const iconStyle =
    "bg-brown-light hover:bg-brown-light-active flex h-10 w-10 cursor-pointer items-center justify-center rounded-full";

  return (
    <FormComponent
      formFields={restaurantFormFields}
      formList={formList}
      setFormList={setFormList}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      isLoading={isLoading}
      navigate={navigate}
      onSubmit={handleEditSubmit}
      deletarDados={deletarDados}
      handleLogout={handleLogout}
      iconStyle={iconStyle}
      baseText={baseText}
      labelStyle={labelStyle}
      title="Minha Conta"
      extraContentBottom={
        <>
          <div className="mt-4">
            <ImagemDeEntidade
              src={restaurantLogo ?? undefined}
              alt="Logo do Restaurante"
              className="h-32 w-1/2 rounded object-cover"
            />
          </div>

          {isEditing && (
            <>
              <ImageUploadButton onFileSelect={(file) => setImageFile(file)} />
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Pré-visualização"
                  className="mt-4 h-32 rounded object-cover"
                />
              )}
            </>
          )}
        </>
      }
    />
  );
}
