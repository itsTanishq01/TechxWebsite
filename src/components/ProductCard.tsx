
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ProductCard({
  title,
  description,
  icon,
  path,
  className,
  style,
}: ProductCardProps) {
  return (
    <Link to={path} className="block h-full">
      <div 
        className={cn(
          "product-card glass-card rounded-xl p-6 flex flex-col h-full cursor-pointer border border-[#c8c8c9] shadow-md dark:border-white/10",
          className
        )}
        style={style}
      >
        <div className="mb-4 text-primary w-12 h-12 flex items-center justify-center rounded-xl bg-primary/5">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 flex-grow">{description}</p>
        
        <div className="mt-auto flex items-center text-primary font-medium group">
          <span>View Details</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
