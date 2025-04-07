import React from "react";
import { PiStarThin } from "react-icons/pi";
import { Link } from "react-router-dom";

type Category = {
  category: "Lanches" | "Doces" | "Comida Japonesa";
};

type Card = {
  id: string;
  img: string;
  name: string;
  rate: GLfloat;
  category: string;
};

type Content = {
  content: Card;
};

function Card({ content }: Content) {
  return (
    <Link to={`/restaurants/${content.id}`}>
      <div className="card m-4 h-fit w-fit bg-white p-4">
        <img src="../assets/ifood.png" className="h-10" alt="iFood Logo"></img>
        <div className="p-2">
          <h3 className="truncate text-lg font-bold">{content.name}</h3>
          <div className="mt-1 flex items-center">
            <div className="flex items-center text-[#EA1D2C]">
              <PiStarThin className="mr-1 h-4 w-4 fill-[#EA1D2C]" />
              <span className="text-sm font-medium">
                {content.rate.toFixed(1)}
              </span>
            </div>
            <span className="text-muted-foreground mx-2">•</span>
            <span className="text-muted-foreground text-sm">
              {content.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Card;
