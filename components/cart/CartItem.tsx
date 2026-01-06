"use client";

import { CartItem as CartItemType, useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCart();
    const price = (item.priceCents / 100).toFixed(2);
    const imageUrl = item.imageUrl || "/images/flower-category.jpg";

    return (
        <div className="flex gap-4 py-4 border-b border-border/50">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border/50 flex-shrink-0 bg-secondary/10">
                <Image
                    src={imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                />
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">
                        {item.brand || "House Brand"} • {item.weight || "Unit"}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-4 text-center">
                            {item.quantity}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="font-bold text-sm">
                            ${(item.priceCents * item.quantity / 100).toFixed(2)}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
