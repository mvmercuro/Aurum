"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/api";
import { DeliveryRequestModal } from "@/components/DeliveryRequestModal";

export function ProductCard({ product }: { product: Product }) {
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const price = (product.priceCents / 100).toFixed(2);
  const imageUrl = product.imageUrl || "/images/flower-category.jpg";
  return (
    <>
      <Link href={`/product/${product.id}`}>
        <div className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer">
          {/* Image Container */}
          <div className="aspect-square overflow-hidden relative bg-secondary/20">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />

            {/* Quick Add Button (Visible on Hover) */}
            {product.inventoryCount > 0 && (
              <div className="absolute bottom-4 right-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                <Button
                  size="icon"
                  className="rounded-full h-10 w-10 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDeliveryModal(true);
                  }}
                >
                  <ShoppingBag className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.strainType && (
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs font-medium border-border/50">
                  {product.strainType.toUpperCase()}
                </Badge>
              )}
              {product.inventoryCount === 0 && (
                <Badge variant="destructive" className="bg-destructive/90 backdrop-blur-sm text-xs font-medium">
                  Out of Stock
                </Badge>
              )}
              {product.inventoryCount > 0 && product.inventoryCount < 5 && (
                <Badge variant="secondary" className="bg-yellow-500/80 text-yellow-950 backdrop-blur-sm text-xs font-medium">
                  Low Stock
                </Badge>
              )}
              {product.inventoryCount >= 5 && (
                <Badge variant="secondary" className="bg-green-500/80 text-green-950 backdrop-blur-sm text-xs font-medium">
                  In Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">{product.brand || "Premium"}</p>
                <h3 className="font-serif font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {product.thcPercentage && (
                <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                  <span className="font-semibold text-foreground">{product.thcPercentage}%</span> THC
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span className="font-medium text-foreground">4.7</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-border/50 mt-2">
              <span className="text-lg font-bold text-foreground">${price}</span>
              <span className="text-xs text-muted-foreground">{product.weight || "3.5g"}</span>
            </div>
          </div>
        </div>
      </Link>
      <DeliveryRequestModal
        open={showDeliveryModal}
        onOpenChange={setShowDeliveryModal}
        product={product}
      />
    </>
  );
}
