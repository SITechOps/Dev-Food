import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { GoClockFill } from "react-icons/go";
import { FaAngleLeft } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { BiSolidHandDown } from "react-icons/bi";
import { GoCopy } from "react-icons/go";
import { Loading } from "@/components/shared/Loading";
import { usePixComponent } from "@/hooks/Pagamento/usePix";
import VisualizacaoConometro from "../components/VisualizacaoConometro";
import { usePagamento } from "@/hooks/Pagamento/usePagamento";

export default function PagePix() {
  const {
    copied,
    key,
    showModal,
    setShowModal,
    statusPagamento,
    eventStaus,
    respPagamento,
    stausPagamentoPix,
    handleCopy,
    tempoDeProcessamento,
    setTempoDeProcessamento,
  } = usePixComponent();
  const { navigate } = usePagamento();

  return (
    <>
      {respPagamento.qr_code_base64 ? (
        <>
          {tempoDeProcessamento === "andamento" && (
            <>
              <div className="items-cente flex justify-center">
                <img
                  key={key}
                  className="w-50"
                  src={`data:image/svg;base64,${respPagamento.qr_code_base64}`}
                  alt="QR Code de Pagamento"
                />
              </div>
              <p className="my-3 w-100 text-center">
                Abra um aplicativo em que você tenha o Pix habilitado e escolha
                a opção Pagar, em seguida Ler QR Code
              </p>

              <div className="text-center">
                <p className="my-2 flex items-center justify-center gap-1">
                  Pix copia e cola
                  <BiSolidHandDown />
                </p>
                <button
                  onClick={handleCopy}
                  className="hover:bg-brown-light-active bg-brown-light text-gray-medium hover:border-brown-normal my-2 w-100 cursor-pointer rounded border px-3 py-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="w-80 truncate bg-transparent">
                      {respPagamento.qr_code}
                    </p>
                    <GoCopy className="icon" />
                  </div>
                </button>
                {copied && <p className="mt-2">Código copiado!</p>}
              </div>

              <VisualizacaoConometro
                onExpire={() => {
                  setTempoDeProcessamento("expirou");
                  setShowModal(false);
                }}
              />

              <Button
                className="bg-brown-light-active text-brown-normal my-6 p-2 hover:text-white"
                onClick={stausPagamentoPix}
              >
                Confirmar pagamento
              </Button>

              <Modal
                isOpen={showModal}
                onClose={() => {
                  setShowModal(false);
                  navigate("/");
                }}
              >
                <div className="my-2">
                  {eventStaus === "andamento" && (
                    <>
                      <VisualizacaoConometro
                        onExpire={() => {
                          setTempoDeProcessamento("expirou");
                          setShowModal(false);
                        }}
                      />

                      <p className="mt-3 text-center">
                        O status do seu pagamento :{" "}
                        <span className="font-bold">{statusPagamento}</span>
                      </p>
                    </>
                  )}

                  {eventStaus === "concluido" && (
                    <>
                      <p className="text-green flex items-center justify-center text-[2rem]">
                        <FaCheckCircle />
                      </p>
                      <p className="mt-3 text-center">
                        Pagamento processado com sucesso! <br />{" "}
                        <span className="font-bold">Pedido em andamento</span>
                      </p>

                      <Button
                        className="mt-5 p-2"
                        onClick={() => navigate("/historico")}
                      >
                        Acompanhe seu pedido
                      </Button>
                    </>
                  )}
                </div>
              </Modal>
            </>
          )}

          {tempoDeProcessamento === "expirou" && (
            <>
              <p className="mb-5">
                <div className="flex items-center justify-center text-2xl">
                  <GoClockFill />
                </div>
                <p className="mt-2 text-center">
                  <span className="font-bold">
                    O tempo para pagamento expirou.{" "}
                  </span>
                  <br />
                </p>
                <p className="mt-1 flex items-center justify-center">
                  Clique em volta (<FaAngleLeft />) para iniciar sua compra
                  novamente!
                </p>
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <Loading />
        </>
      )}
    </>
  );
}
