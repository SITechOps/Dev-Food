import FormComponent from "../../components/ui/FormComponent";
import { useUserAccount } from "../../hooks/useUserAccount";

export default function UserForm() {
  const {
    navigate,
    userFormList,
    setUserFormList,
    userFormFields,
    isEditing,
    setIsEditing,
    loading,
    handleLogout,
    deletarDados,
    alterarDados,
  } = useUserAccount();
  const baseText =
    "text-blue mt-3 flex items-center justify-start gap-2 p-0 text-lg";
  const iconStyle =
    "bg-brown-light hover:bg-brown-light-active flex h-10 w-10 cursor-pointer items-center justify-center rounded-full";

  return (
    <>
      <div className="w-2/3">
        <FormComponent
          formFields={userFormFields}
          formList={userFormList}
          setFormList={setUserFormList}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isLoading={loading}
          navigate={navigate}
          onSubmit={alterarDados}
          deletarDados={deletarDados}
          handleLogout={handleLogout}
          iconStyle={iconStyle}
          baseText={baseText}
          title="Minha Conta"
        />
      </div>
    </>
  );
}
