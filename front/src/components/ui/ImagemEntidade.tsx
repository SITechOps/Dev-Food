import React from "react";
import { API_BASE_URL } from "@/connection/apiConfig";

type ImagemDeEntidadeProps = {
  src?: string;
  alt: string;
  className?: string;
};

export const ImagemDeEntidade: React.FC<ImagemDeEntidadeProps> = ({
  src,
  alt,
  className = "h-15 w-15 rounded-full object-cover",
}) => {
  const fallback =
    "https://food-guide.canada.ca/sites/default/files/styles/square_400_x_400/public/2020-12/CFGPlate-crop400x400.jpg";

  return (
    <img
      src={src ? `${API_BASE_URL}${src}` : fallback}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};
