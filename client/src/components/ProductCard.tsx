import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star } from "lucide-react";

interface ProductProps {
  id: string;
  name: string;
  brand: string;
  category: string;
  thc: string;
  price: number;
  image: string;
  rating: number;
  tags?: string[];
}

export function ProductCard({ product }: { product: ProductProps }) {
  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
      {/* Image Container */}
      <div className="aspect-square overflow-hidden relative bg-secondary/20">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
        
        {/* Quick Add Button (Visible on Hover) */}
        <div className="absolute bottom-4 right-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button size="icon" className="rounded-full h-10 w-10 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs font-medium border-border/50">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">{product.brand}</p>
            <h3 className="font-serif font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
            <span className="font-semibold text-foreground">{product.thc}</span> THC
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span className="font-medium text-foreground">{product.rating}</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-border/50 mt-2">
          <span className="text-lg font-bold text-foreground">${product.price}</span>
          <span className="text-xs text-muted-foreground">3.5g</span>
        </div>
      </div>
    </div>
  );
}
