import { IoIosArrowDown } from "react-icons/io";

export default function ListagemEndereco() {
  function mostrarEnderecoSalvo() {
    console.log("exibiu todos os endereço salvos");
  }

  return (
    <>
      <p
        className="flex items-center justify-between gap-2"
        onClick={mostrarEnderecoSalvo}
      >
        Endereço já salvo
        <IoIosArrowDown className="icon" />
      </p>
    </>
  );
}
