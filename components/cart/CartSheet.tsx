"use client";

import { useCart } from "@/contexts/CartContext";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartItem } from "./CartItem";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function CartSheet() {
    const { items, isCartOpen, setIsCartOpen, cartTotal } = useCart();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close cart when navigating
    useEffect(() => {
        setIsCartOpen(false);
    }, [pathname, setIsCartOpen]);

    if (!mounted) return null;

    const total = (cartTotal / 100).toFixed(2);
    const freeDeliveryThreshold = 5000; // $50.00
    const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartTotal);

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent className="w-full sm:w-[400px] flex flex-col h-full p-0">
                <SheetHeader className="p-6 border-b border-border">
                    <SheetTitle className="flex items-center gap-2 font-serif text-2xl">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                        Your Bag
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
                            <ShoppingBag className="h-16 w-16 opacity-20" />
                            <p className="text-lg font-medium">Your bag is empty</p>
                            <Button
                                variant="outline"
                                onClick={() => setIsCartOpen(false)}
                                className="mt-4"
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t border-border bg-secondary/5 space-y-4">
                        {remainingForFreeDelivery > 0 ? (
                            <div className="text-xs text-center text-muted-foreground">
                                Add <span className="text-primary font-bold">${(remainingForFreeDelivery / 100).toFixed(2)}</span> more for free delivery
                            </div>
                        ) : (
                            <div className="text-xs text-center text-green-600 font-medium">
                                You&apos;ve unlocked free delivery! 🎉
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Subtotal</span>
                                <span>${total}</span>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                Taxes and delivery calculated at checkout
                            </p>
                        </div>

                        <Button
                            className="w-full font-bold h-12 text-base"
                            onClick={() => setIsCartOpen(false)}
                            asChild
                        >
                            <Link href="/checkout">
                                Checkout <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
