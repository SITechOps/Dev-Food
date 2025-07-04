import { useEffect, useRef, useState } from "react";
import { usePagamento } from "./usePagamento";
import {
  ICreatFormCartao,
  ITokenCartao,
} from "@/features/(Usuario)/components/Pagamento/interface/IPagamento";
import { api } from "@/lib/axios";
import { usePagamentoContext } from "@/shared/contexts/PagamentoContext";
import {
  showError,
  showSuccess,
  showWarning,
} from "@/shared/components/ui/AlertasPersonalizados/toastAlerta";
export {};

declare global {
  interface Window {
    MercadoPago: any;
  }
}

let mpInstance: any = null;

export const useCartaoComponent = () => {
  const cardFormRef = useRef<boolean>(false);
  const [isCardFormReady, setIsCardFormReady] = useState<boolean>(false);
  const cardFormInstanceRef = useRef<any>(null);
  const [formKey, setFormKey] = useState<number>(Date.now());
  const { valoresCarrinho, postPedido } = usePagamento();
  const [showModal, setShowModal] = useState(false);
  const [etapa, setEtapa] = useState<"incial" | "novoCartao">("incial");
  const [loadingGenerico, setLoadingGenerico] = useState(false);
  const { resetPagamento } = usePagamentoContext();

  useEffect(() => {
    if (showModal) {
      emissaoCartaoMercadoPago();
    }
  }, [showModal]);

  function emissaoCartaoMercadoPago() {
    if (!window.MercadoPago) {
      showError("SDK do Mercado Pago não carregado.");
    }

    if (cardFormRef.current) {
      showWarning("CardForm já foi montado, evitando recriação.");
      return;
    }

    mpInstance = new window.MercadoPago(
      import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY,
      {
        locale: "pt-BR",
      },
    );

    cardFormInstanceRef.current = mpInstance.cardForm({
      amount: valoresCarrinho.total.toFixed(2),
      autoMount: true,
      form: {
        id: "form-checkout",
        cardholderEmail: { id: "form-checkout__email" },
        cardholderName: { id: "form-checkout__cardholderName" },
        cardNumber: { id: "form-checkout__cardNumber" },
        expirationDate: { id: "form-checkout__expirationDate" },
        securityCode: { id: "form-checkout__securityCode" },
        installments: { id: "form-checkout__installments" },
        identificationType: { id: "form-checkout__identificationType" },
        identificationNumber: { id: "form-checkout__identificationNumber" },
        issuer: { id: "form-checkout__issuer" },
      },
      callbacks: {
        onFormMounted: () => {
          setIsCardFormReady(true);
          showSuccess("Formulário montado com sucesso");
        },
        onError: (error: any) => {
          showError("erro form:", error);
        },
      },
    });
    cardFormRef.current = true;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isCardFormReady) {
      showError("O formulário ainda não foi montado.");
    }

    try {
      const formData = cardFormInstanceRef.current?.getCardFormData?.();
      if (!formData) {
        showError("Falha ao obter dados do cartão.");
      }

      if (formData.token) {
        await postCartao(formData);
      }
    } catch (error) {
      showError("erro handleSubmit:");
      console.log("erro handleSubmit:", error);
    }
  }

  async function postCartao(dados: ICreatFormCartao) {
    try {
      const payload = {
        token: dados.token,
        cardholderEmail: dados.cardholderEmail,
        transaction_amount: parseFloat(dados.amount),
        installments: parseFloat(dados.installments),
        identification_type: dados.identificationType,
        identification_number: dados.identificationNumber,
        payment_method_id: dados.paymentMethodId,
      };

      const response = await api.post<ITokenCartao>("/cartao", payload);
      showSuccess("Pagamento realizado com sucesso");
      console.log("Pagamento realizado com sucesso:", response.data);

      if (response) {
        setShowModal(false);
        await postPedido("cartao");
      }
    } catch (error) {
      setTimeout(() => {
        resetPagamento();
      }, 0);
      console.log("erro", error);
    }
  }

  function adicionarCartao() {
    cardFormRef.current = false;
    setShowModal(true);
    setFormKey(Date.now());
  }

  function simulacaoGenerica() {
    const dadosMock = {
      token: "85f87b05-2c23-4018-919b-20851de3dfe8",
      amount: valoresCarrinho.total.toFixed(2),
      installments: "3",
      identificationType: "CPF",
      identificationNumber: "12345678909",
      paymentMethodId: "master",
      cardholderEmail: "email@exemplo.com",
      issuerId: "123",
      merchantAccountId: "456",
      processingMode: "default",
    };

    setLoadingGenerico(true);

    setTimeout(() => {
      postCartao(dadosMock)
        .then(() => {
          showSuccess("Simulação concluída.");
        })
        .catch((error) => {
          showError("Erro ao processar o pagamento:", error);
        })
        .finally(() => {
          setLoadingGenerico(false);
        });
    }, 1000);
  }
  return {
    isCardFormReady,
    setIsCardFormReady,
    formKey,
    setFormKey,
    showModal,
    setShowModal,
    etapa,
    setEtapa,
    loadingGenerico,
    setLoadingGenerico,
    adicionarCartao,
    simulacaoGenerica,
    handleSubmit,
  };
};
