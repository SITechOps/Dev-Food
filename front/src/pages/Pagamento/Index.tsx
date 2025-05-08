import Button from "../../components/ui/Button";
import { SiPix } from "react-icons/si";
import { TfiMapAlt } from "react-icons/tfi";
import { BsCreditCardFill } from "react-icons/bs";
import PagePix from "./FormasPagamento/Pix";
import PageCartao from "./FormasPagamento/Cartao";
import CardsOpcoes from "./components/CardsOpcoes";
import IconAction from "@/components/ui/IconAction";
import { usePagamento } from "@/hooks/Pagamento/usePagamento";
import { useTaxaEntrega } from "@/contexts/TaxaEntregaContext";

export default function Pagamento() {
  const {
    restaurante,
    valoresCarrinho,
    endereco,
    etapa,
    setEtapa,
    modeloPagamento,
    setModeloPagamento,
  } = usePagamento();

  const {
    taxaEntregaSelecionada,
    taxaEntregaPadrao,
    taxaEntregaRapida,
    duracaoPadrao,
    duracaoRapida,
    handleSelecionado,
  } = useTaxaEntrega();


  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 xl:flex-row">
      <div className="card border-gray-light m-auto mt-[5rem] border p-4">
        <h1 className="my-8 text-center font-medium">Finalize seu pedido</h1>

        <div>
          <p className="text-brown-normal border-brown-normal mb-5 w-50 rounded-sm border-b-2 pb-2 text-center transition-all">
            Entrega
          </p>
          <div className="flex items-center gap-5">
            <TfiMapAlt className="text-3xl" />
            <div className="my-4 flex w-full items-center justify-between gap-4">
              <div>
                <p className="font-semibold break-words">{endereco.rua}</p>
                <p className="break-words w-80">{endereco.complemento}</p>
              </div>
            </div>
          </div>
          <hr className="text-gray-light my-2" />
        </div>
        <div className="mt-5 text-center">
          <h2 className="mb-4 text-xl font-semibold">
            Escolha o tipo de entrega
          </h2>
          <p className="text-sm text-gray-600">
            Selecione a forma de entrega para ver o valor da taxa e o tempo
            estimado.
          </p>
        </div>
        <div className="mt-5 flex gap-5">
          <div
            onClick={() => handleSelecionado("padrão")}
            className={`w-full cursor-pointer rounded-lg border-2 p-4 ${taxaEntregaSelecionada === taxaEntregaPadrao
              ? "border-brown-normal text-brown-dark"
              : "border-gray-300"
              }`}
          >
            <p className="font-semibold">Padrão</p>
            <p className="text-sm font-semibold">Hoje, {duracaoPadrao}</p>
            <p className="mt-2 font-semibold text-blue">
              R$ {taxaEntregaPadrao.toFixed(2)}
            </p>
          </div>
          <div
            onClick={() => handleSelecionado("rápida")}
            className={`w-full cursor-pointer rounded-lg border-2 p-4 ${taxaEntregaSelecionada === taxaEntregaRapida
              ? "border-brown-normal text-brown-dark"
              : "border-gray-300"
              }`}
          >
            <p className="font-semibold">Rápida</p>
            <p className="text-sm font-semibold">Hoje, {duracaoRapida}</p>
            <p className="mt-2 font-semibold text-blue">
              R$ {taxaEntregaRapida.toFixed(2)}
            </p>
          </div>
        </div>
        <hr className="text-gray-light mb-2 mt-6" />
        <div>
          <div className="mb-10 flex w-100 items-center justify-between">
            <Button
              onClick={() => {
                setModeloPagamento("site");
              }}
              color="plain"
              className={`border-b-2 pb-2 transition-all ${modeloPagamento === "site"
                ? "text-brown-normal border-brown-normal"
                : "hover:text-blue-dark border-transparent"
                }`}
            >
              Pague pelo site
            </Button>
            <Button
              onClick={() => {
                setModeloPagamento("entrega");
              }}
              color="plain"
              className={`border-b-2 pb-2 transition-all ${modeloPagamento === "site"
                ? "text-blue hover:text-blue-dark border-transparent"
                : "text-brown-normal border-brown-normal"
                }`}
            >
              Pague na entrega
            </Button>
          </div>
          {modeloPagamento === "site" && (
            <>
              {etapa === "opcaoPagamento" && (
                <>
                  <CardsOpcoes
                    icon={<SiPix />}
                    title="Pague com Pix"
                    subtitle="Use o QR Code ou copie e cole o código"
                    onClick={() => setEtapa("pagePix")}
                  />
                  <CardsOpcoes
                    icon={<BsCreditCardFill />}
                    title="Pague com cartão"
                    subtitle="Cadastre-se seu cartao ou Escolha seu cartão"
                    onClick={() => setEtapa("pageCartao")}
                  />
                </>
              )}

              {etapa === "pagePix" && (
                <>
                  <IconAction onClick={() => setEtapa("opcaoPagamento")}>
                    Pix
                  </IconAction>
                  <PagePix />
                </>
              )}
              {etapa === "pageCartao" && (
                <>
                  <IconAction onClick={() => setEtapa("opcaoPagamento")}>
                    Cartão
                  </IconAction>
                  <PageCartao />
                </>
              )}
            </>
          )}
          {modeloPagamento === "entrega" && (
            <p className="text-center font-bold">Tela em construção....</p>
          )}
        </div>
      </div>
      <div
        id="cardLateral"
        className="card border-gray-light m-auto mt-[5rem] w-100 border p-4"
      >
        <p className="my-2 flex items-center justify-between gap-8">
          Compra realizado no restaurante:
        </p>
        <span className="font-bold">{restaurante}</span>
        <hr className="border-gray-medium my-4 border-b" />
        <p className="my-2 flex items-center justify-between gap-8">
          Subtotal
          <span>R$ {valoresCarrinho.subtotal.toFixed(2)}</span>
        </p>
        <p className="my-2 flex items-center justify-between gap-8">
          Taxa de entrega
          <span>R$ {taxaEntregaSelecionada.toFixed(2)}</span>
        </p>
        <p className="mt-10 flex items-center justify-between gap-8 font-bold">
          Total
          <span>
            R$ {(valoresCarrinho.subtotal + taxaEntregaSelecionada).toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
}