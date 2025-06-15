import { useState } from "react";
import { Paperclip } from "lucide-react";

interface ImageUploadButtonProps {
  onFileSelect: (file: File) => void;
}

const ImageUploadButton = ({ onFileSelect }: ImageUploadButtonProps) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      onFileSelect(file);
      setFileName(file.name);
    }
  };

  return (
    <div className="space-y-4">
      <label className="hover:bg-brown-light-active bg-brown-light text-blue mt-2 inline-flex cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200">
        <Paperclip className="text-brown-normal mr-2" />
        Selecione uma imagem
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      {fileName && (
        <p className="mt-2 text-sm text-gray-700">
          Arquivo selecionado: {fileName}
        </p>
      )}
    </div>
  );
};

export default ImageUploadButton;
