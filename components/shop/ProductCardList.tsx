"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";
import Link from "next/link";
import { Product } from "@/lib/api";

export interface ProductWithCategory extends Product {
    category?: { name: string } | null;
}

export function ProductCardList({ product }: { product: ProductWithCategory }) {
    const price = (product.priceCents / 100).toFixed(2);
    // Default image if missing
    const imageUrl = product.imageUrl || "/images/flower-category.jpg";

    return (
        <Link href={`/product/${product.id}`} className="block group">
            <div className="flex bg-card rounded-lg border border-border/40 hover:border-primary/50 transition-all duration-300 overflow-hidden h-40 w-full hover:shadow-md">
                {/* Left: Image Section */}
                <div className="relative w-40 h-40 flex-shrink-0 bg-secondary/10">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Favorite Heart (Weedmaps style) */}
                    <button
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            // Todo: Toggle favorite
                        }}
                    >
                        <Heart className="h-4 w-4" />
                    </button>

                    {/* Out of Stock Overlay */}
                    {product.inventoryCount === 0 && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
                            <Badge variant="destructive" className="font-bold">Sold Out</Badge>
                        </div>
                    )}
                </div>

                {/* Middle: Info Section */}
                <div className="flex flex-col flex-grow p-4 justify-between">
                    <div className="space-y-1">
                        {/* Category / Strain Type Tag */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                {product.category?.name || "FLOWER"}
                            </span>
                            {product.strainType && (
                                <span className="text-[10px] font-bold tracking-widest text-[#00CDBC]/80 uppercase px-1.5 py-0.5 rounded bg-[#00CDBC]/10">
                                    {product.strainType}
                                </span>
                            )}
                        </div>

                        {/* Classification / Name */}
                        <h3 className="font-bold text-base md:text-lg text-foreground leading-tight group-hover:text-[#00CDBC] transition-colors line-clamp-2">
                            {product.name}
                        </h3>

                        {/* Brand */}
                        <p className="text-sm text-muted-foreground font-medium">
                            {product.brand || "House Brand"}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-1">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
                        </div>
                    </div>

                    {/* Bottom Row inside Middle (Mobile typically breaks this) */}
                    <div className="flex items-center gap-2 mt-2">
                        {product.thcPercentage && (
                            <Badge variant="secondary" className="text-[10px] bg-secondary/50 rounded-sm px-1.5 font-normal text-muted-foreground border-0">
                                {product.thcPercentage}% THC
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Right: Price & Action */}
                <div className="flex flex-col justify-between items-end p-4 min-w-[120px] text-right border-l border-border/30 bg-secondary/5">
                    <div>
                        <div className="flex items-baseline justify-end gap-1">
                            <span className="font-bold text-lg">${price}</span>
                            <span className="text-xs text-muted-foreground font-normal">
                                {product.weight || "/ each"}
                            </span>
                        </div>
                    </div>

                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            // Add to cart logic
                        }}
                        className="rounded-full bg-[#00CDBC] hover:bg-[#00b2a3] text-white font-semibold text-sm h-8 px-6 w-full shadow-sm hover:shadow-md transition-all"
                    >
                        Add
                    </Button>
                </div>
            </div>
        </Link>
    );
}
