import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ModalProduto from "@/components/Produto/ModalProduto";
import { Search } from "lucide-react";
import useProdutos from "@/hooks/useProducts";
import { ImagemDeEntidade } from "../ui/ImagemEntidade";

const Cardapios = () => {
  const iconStyle =
    "bg-brown-light hover:bg-brown-light-active flex h-8 w-8 cursor-pointer items-center justify-center rounded-full";

  const {
    produtosFiltrados,
    deletarProduto,
    handleSearch,
    isModalOpen,
    abrirModalAdicionar,
    abrirModalEditar,
    fecharModal,
    produtoSelecionado,
    criarProduto,
    editarProduto,
    isUploading,
  } = useProdutos();

  return (
    <div className="rounded-[10px] bg-white p-6">
      <div className="h-w-auto mb-6 flex items-center gap-10">
        <Button
          className="w-3xs"
          onClick={abrirModalAdicionar}
          disabled={isUploading}
        >
          Adicionar Produto
        </Button>

        <div className="relative w-full max-w-sm">
          <Search
            className="text-gray-medium absolute top-1/2 left-3 -translate-y-1/2"
            size={18}
          />
          <Input
            type="text"
            placeholder="Buscar produto"
            className="!mt-0 h-full !pl-10"
            onChange={handleSearch}
            disabled={isUploading}
          />
        </div>
      </div>

      <div className="border-gray-medium overflow-x-auto rounded-md border">
        <div className="bg-brown-light text-brown-normal grid grid-cols-[140px_180px_200px_130px_120px] text-lg font-semibold sm:grid-cols-[1fr_2fr_3fr_2fr_2fr]">
          <div className="flex items-center justify-center p-4">Foto</div>
          <div className="flex items-center justify-center p-4">Produto</div>
          <div className="flex items-center justify-center p-4">Descrição</div>
          <div className="flex items-center justify-center p-4">Preço</div>
          <div className="flex items-center justify-center p-4">Ações</div>
        </div>

        {produtosFiltrados.length === 0 && !isUploading ? (
          <div className="w-full p-4 text-center">
            Nenhum produto encontrado.
          </div>
        ) : (
          produtosFiltrados.map((product) => (
            <div
              key={product.id}
              className="border-gray-medium grid grid-cols-[140px_180px_200px_130px_120px] border-t bg-white px-2.5 sm:grid-cols-[1fr_2fr_3fr_2fr_2fr]"
            >
              <div className="flex flex-col items-center justify-center py-4">
                <ImagemDeEntidade
                  src={product.image_url}
                  alt={product.nome}
                  className="h-20 w-20 border object-cover"
                />
                <span className="text-blue mt-2 text-sm">
                  Qtd: {product.qtd_estoque}
                </span>
              </div>

              <div className="flex items-center justify-center p-4">
                <span className="text-blue text-center leading-snug">
                  {product.nome}
                </span>
              </div>

              <div className="flex items-center justify-center p-4">
                <span className="text-blue text-center leading-snug">
                  {product.descricao}
                </span>
              </div>

              <div className="flex items-center justify-center p-4">
                <span className="text-blue font-medium">
                  R$ {product.valor_unitario}
                </span>
              </div>

              <div className="flex items-center justify-center gap-4 p-4">
                <div
                  id="Editar"
                  className={iconStyle}
                  onClick={() => abrirModalEditar(product)}
                >
                  <FiEdit2 className="icon" />
                </div>
                <div className="bg-gray-medium h-6 w-px"></div>
                <div
                  id="deletar"
                  className={iconStyle}
                  onClick={() => deletarProduto(product.id)}
                >
                  <AiOutlineDelete className="icon" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ModalProduto
        isOpen={isModalOpen}
        onClose={fecharModal}
        produto={produtoSelecionado}
        criarProduto={criarProduto}
        editarProduto={editarProduto}
      />
    </div>
  );
};

export default Cardapios;
