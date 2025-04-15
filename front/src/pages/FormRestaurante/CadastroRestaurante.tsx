import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ModalEmail from "../../components/ModalEmail";
import { useNavigate } from "react-router-dom";
import { api } from "../../connection/axios";

export default function CadastroRestaurante() {
  const [formList, setFormList] = useState({
    nome: "",
    telefone: "",
    email: "",
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [codigoEnviado, setCodigoEnviado] = useState("");

  const navigate = useNavigate();

  async function continuarCadastro() {
    setMostrarModal(true);
    try {
      const response = await api.post("/send-email", {
        data: {
          email: formList.email,
        },
      });
      setCodigoEnviado(response.data.properties.verificationCode);
    } catch (error) {
      console.error("Erro na tentativa do envio do codigo:", error);
      alert("Erro na tentativa do envio do codigo");
    }
  }

  return (
    <div className="relative flex h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        <form className="h-auto w-96 rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-xl font-bold">Que bom te ver por aqui!</h1>
          <p className="mt-2 text-sm text-gray-600">
            As informações abaixo serão usadas para iniciar o cadastro do seu
            restaurante
          </p>
          <div className="mt-6 space-y-4 text-left">
            <Input
              id="nome"
              name="nome"
              textLabel="Infome o nome Completo:"
              placeholder="Digite seu nome e sobrenome"
              value={formList.nome}
              onChange={(value) =>
                setFormList({ ...formList, nome: value })
              }
              type="text"
              required
            />

            <Input
              id="telefone"
              name="telefone"
              textLabel="Insira seu Telefone:"
              placeholder="(00) 00000-0000"  // faltou formatar use o PatternFormat, NumberFormatValues
              value={formList.telefone}
              onChange={(value) =>
                setFormList({ ...formList, telefone: value })
              }
              type="text"
              required
            />

            <Input
              textLabel="Infome seu E-mail:"
              id="email"
              name="email"
              placeholder="exemplo@gmail.com"
              value={formList.email}
              onChange={(value) =>
                setFormList({ ...formList, email: value })
              }
              type="email"
              required
            />

            <p className="mt-4 text-sm text-gray-500">
              Para ajustar, volte para tela anterior
            </p>
          </div>
        </form>

        <Button
          className="mt-6 w-48"
          type="button"
          disabled={!formList.nome || !formList.telefone || !formList.email}
          onClick={continuarCadastro}
        >
          Continuar
        </Button>
      </div>

      {mostrarModal && (
        <ModalEmail
          codigoEnviado={codigoEnviado}
          isModalOpen={mostrarModal}
          setIsModalOpen={setMostrarModal}
          tipoEnvioCodigo={"email"}
          onSuccess={() => navigate("/dados-restaurante")}
        />
      )}
    </div>
  );
}
