import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import CategoryCard from "./CategoriaCard";
import { categories } from "./categories";

interface CategoriasProps {
  onCategoryClick: (category: string) => void;
}

export default function Categorias({ onCategoryClick }: CategoriasProps) {
  return (
    <Carousel>
      <div className="flex items-center gap-2">
        <CarouselPrevious className="text-brown-normal static" />
        <CarouselContent>
          {categories.map((category, index) => (
            <CarouselItem key={index} className="basis-auto">
              <CategoryCard
                image={category.image}
                label={category.label}
                color={category.color}
                onClick={() => onCategoryClick(category.label)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="text-brown-normal static" />
      </div>
    </Carousel>
  );
}
