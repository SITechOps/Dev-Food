interface CategoryCardProps {
  image: string;
  label: string;
  selected?: boolean;
  color: string;
  onClick: () => void;
}

export default function CategoryCard({
  image,
  label,
  color,
  onClick,
}: CategoryCardProps) {
  return (
    <div
      className="mx-4 my-1 h-32 w-32 transform cursor-pointer rounded-2xl transition-all hover:scale-105 hover:shadow-lg"
      style={{
        background: `linear-gradient(${color} 50%, white 50%)`,
      }}
      onClick={onClick}
    >
      <div className="flex h-full flex-col items-center justify-center p-2">
        <div className="flex flex-1 items-center justify-center">
          <img
            src={image}
            alt={label}
            className="max-h-20 max-w-full object-contain"
          />
        </div>
        <span className="text-blue mt-1 text-base">{label}</span>
      </div>
    </div>
  );
}
