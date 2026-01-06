"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/api";

interface AddToCartButtonProps {
    product: Product;
    large?: boolean;
}

export function AddToCartButton({ product, large = false }: AddToCartButtonProps) {
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addItem(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <Button
            size={large ? "lg" : "default"}
            className={large ? "w-full" : ""}
            onClick={handleAddToCart}
            disabled={product.inventoryCount === 0}
        >
            {isAdded ? (
                <>
                    <Check className="h-5 w-5 mr-2" />
                    Added to Bag
                </>
            ) : (
                <>
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    {product.inventoryCount === 0 ? "Out of Stock" : "Add to Cart"}
                </>
            )}
        </Button>
    );
}
