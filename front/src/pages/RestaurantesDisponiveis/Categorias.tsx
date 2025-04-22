import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import CategoryCard from "./components/CategoriaCard";
import { categories } from "./components/categories";

interface CategoriasProps {
  onCategoryClick: (category: string) => void;
}

export default function Categorias({ onCategoryClick }: CategoriasProps) {
  return (
    <Carousel>
      <CarouselContent>
        {categories.map((category, index) => (
          <CarouselItem key={index} className="basis-auto">
            <CategoryCard
              image={category.image}
              label={category.label}
              color={category.color}
              // Passando a categoria selecionada para o onClick
              onClick={() => onCategoryClick(category.label)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="text-brown-normal" />
      <CarouselNext className="text-brown-normal" />
    </Carousel>
  );
}
