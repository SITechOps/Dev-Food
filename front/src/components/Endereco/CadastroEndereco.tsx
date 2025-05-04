import { useEffect } from "react";
import { PiGpsFixDuotone } from "react-icons/pi";
import { TbHomeFilled } from "react-icons/tb";
import { IoBusiness } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useEndereco } from "../../hooks/useAddress";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useSearchParams } from "react-router-dom";

const CadastroEndereco = () => {
  const {
    address,
    numero,
    complemento,
    tipo,
    role,
    setNumero,
    setComplemento,
    searchInput,
    findMyLocation,
    handleFavoritar,
    handleCadastrar,
    handleEditar,
    fecharModal,
  } = useEndereco();

  const [searchParams] = useSearchParams();
  const enderecoParam = searchParams.get("endereco");

  useEffect(() => {
    const enderecoParam = searchParams.get("endereco");
    if (enderecoParam) {
      try {
        const parsedEndereco = JSON.parse(decodeURIComponent(enderecoParam));
        // Preencha os campos do formulário com os dados do endereço
        if (parsedEndereco) {
          setNumero(parsedEndereco.numero.toString());
          setComplemento(parsedEndereco.complemento);
          // set search input
          if (searchInput.current) {
            searchInput.current.value = `${parsedEndereco.logradouro}, ${parsedEndereco.numero}, ${parsedEndereco.bairro}, ${parsedEndereco.cidade}, ${parsedEndereco.estado}`;
          }
          // Você pode adicionar mais campos conforme necessário
        }
      } catch (error) {
        console.error("Erro ao parsear o endereço:", error);
      }
    }
  }, [searchParams, setNumero, setComplemento]);

  return (
    <section className="fixed inset-0 flex h-screen items-center justify-center bg-black/50">
      <div className="mt-5 w-96">
        <form
          className="relative mt-5 rounded-md bg-white p-6"
          onSubmit={handleCadastrar}
        >
          <IoClose
            className="absolute top-3 right-4 cursor-pointer text-gray-600 transition-colors hover:text-black"
            size={26}
            onClick={fecharModal}
          />

          <legend className="mx-2 text-center font-bold">
            Informe seu endereço
          </legend>

          <div className="relative my-2 w-full">
            <Input
              ref={searchInput}
              type="text"
              placeholder="Digite o endereço..."
              className="w-full"
            />
            <button
              type="button"
              onClick={findMyLocation}
              className="icon bg-gray-light absolute top-1/2 right-3 -translate-y-1/2 transform pl-2"
            >
              <PiGpsFixDuotone />
            </button>
          </div>

          {address && (
            <>
              <hr className="text-gray-medium my-5 rounded-lg" />
              <div className="mb-2 flex w-full items-center space-x-2 rounded-lg bg-gray-100 p-3">
                <FaMapMarkerAlt className="!text-brown-dark icon" />
                <p>
                  <span className="font-semibold">
                    {address.logradouro || address.pais}
                  </span>
                  {address.logradouro || address.pais
                    ? `, ${address.cidade || address.bairro} - ${address.estado}`
                    : address.logradouro || address.pais
                      ? `, ${address.cidade || address.bairro}`
                      : ""}
                </p>
              </div>

              <div id="dados-complementares">
                <div className="mb-3 flex gap-4">
                  <Input
                    type="text"
                    value={numero}
                    placeholder="Número"
                    onChange={(value) => setNumero(value)}
                    className="w-24"
                  />

                  <Input
                    type="text"
                    value={complemento}
                    placeholder="Complemento"
                    onChange={(value) => setComplemento(value)}
                    className="w-52"
                  />
                </div>

                {role != "restaurante" && (
                  <div className="mt-5">
                    <label>Favoritar como:</label>
                    <div className="my-5 flex space-x-4">
                      <button
                        type="button"
                        onClick={() => handleFavoritar("Casa")}
                        className={`bg-gray-light text-gray-medium flex items-center space-x-2 rounded px-2 py-1 transition-all duration-300 ease-in-out ${
                          tipo === "Casa"
                            ? "border-brown-normal border-2"
                            : "hover:border-gray-medium border-2 border-transparent"
                        }`}
                      >
                        <TbHomeFilled
                          className={`transition-colors duration-300 ${
                            tipo === "Casa"
                              ? "text-brown-normal"
                              : "text-gray-medium hover:text-gray-medium"
                          }`}
                        />
                        <span>Casa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFavoritar("Trabalho")}
                        className={`bg-gray-light text-gray-medium flex items-center space-x-2 rounded px-2 py-1 transition-all duration-300 ease-in-out ${
                          tipo === "Trabalho"
                            ? "border-brown-normal border-2"
                            : "hover:border-gray-medium border-2 border-transparent"
                        }`}
                      >
                        <IoBusiness
                          className={`transition-colors duration-300 ${
                            tipo === "Trabalho"
                              ? "text-brown-normal"
                              : "text-gray-medium hover:text-gray-medium"
                          }`}
                        />
                        <span>Trabalho</span>
                      </button>
                    </div>
                  </div>
                )}
                {enderecoParam && (
                <Button
                  type="submit"
                  disabled={!address || !numero}
                  className="mt-4"
                  onClick={handleEditar}
                >
                    Editar endereço
                </Button>
                )}
                {!enderecoParam && (
                  <Button
                    type="submit"
                    disabled={!address || !numero}
                    className="mt-4"
                  >
                    Cadastrar endereço
                  </Button>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default CadastroEndereco;