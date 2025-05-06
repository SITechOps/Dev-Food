import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import Input from "../../components/ui/Input";
import Button from "@/components/ui/Button";
import ImageUploadButton from "@/components/ui/ImageUploadButton";
import { ProductProps } from "@/interface/IProduct";

interface ModalProdutoProps {
  isOpen: boolean;
  onClose: () => void;
  produto?: ProductProps | null;
  criarProduto: (
    produto: Omit<ProductProps, "id">,
    imageFile?: File | null,
  ) => Promise<void>;
  editarProduto: (
    id: string,
    produto: Omit<ProductProps, "id">,
    imageFile?: File | null,
  ) => Promise<void>;
}

export default function ModalProduto({
  isOpen,
  onClose,
  produto,
  criarProduto,
  editarProduto,
}: ModalProdutoProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");
  const [qtdEstoque, setQtdEstoque] = useState("");
  const [image_url, setimage_url] = useState("");
  const [imageFile, setimageFile] = useState<File | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (produto) {
      setNome(produto.nome);
      setDescricao(produto.descricao);
      setValorUnitario(produto.valor_unitario.toString());
      setQtdEstoque(produto.qtd_estoque.toString());
      setimage_url(produto.image_url);
    } else {
      setNome("");
      setDescricao("");
      setValorUnitario("");
      setQtdEstoque("");
      setimage_url("");
    }
  }, [produto]);

  const handleSubmit = async () => {
    const dadosProduto = {
      nome,
      descricao,
      valor_unitario: parseFloat(valorUnitario),
      qtd_estoque: parseInt(qtdEstoque),
      image_url,
    };

    try {
      if (produto?.id) {
        await editarProduto(produto.id, dadosProduto, imageFile);
      } else {
        await criarProduto(dadosProduto, imageFile);
      }
      onClose();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex h-screen items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="border-blue relative flex flex-col gap-6 rounded-lg border-2 bg-white p-10 pt-12"
      >
        <IoClose
          className="icon absolute top-3 right-4 cursor-pointer"
          size={26}
          onClick={onClose}
        />

        <div className="flex w-96 flex-col gap-4">
          <Input
            textLabel="Nome do produto:"
            placeholder="Ex: Coca-Cola 350ml"
            value={nome}
            onChange={(value) => setNome(value)}
          />
          <Input
            textLabel="Descrição:"
            placeholder="Ex: Refrigerante gelado"
            value={descricao}
            onChange={(value) => setDescricao(value)}
          />
          <Input
            textLabel="Valor unitário:"
            type="number"
            placeholder="Ex: 4.99"
            value={valorUnitario}
            onChange={(value) => setValorUnitario(value)}
          />
          <Input
            textLabel="Quantidade em estoque:"
            type="number"
            placeholder="Ex: 20"
            value={qtdEstoque}
            onChange={(value) => setQtdEstoque(value)}
          />

          <ImageUploadButton onFileSelect={(file) => setimageFile(file)} />

          <Button onClick={handleSubmit} className="p-2">
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
