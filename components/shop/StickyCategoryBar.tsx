"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Mock categories matching Weedmaps + common ones
const CATEGORIES = [
    { id: "all", name: "All Products" },
    { id: "flower", name: "Flower" },
    { id: "vape-pens", name: "Vape Pens" },
    { id: "edibles", name: "Edibles" },
    { id: "concentrates", name: "Concentrates" },
    { id: "pre-rolls", name: "Pre-rolls" },
    { id: "topicals", name: "Topicals" },
    { id: "gear", name: "Gear" },
    { id: "cultivation", name: "Cultivation" },
];

interface StickyCategoryBarProps {
    activeCategory: string;
    onSelectCategory: (id: string) => void;
}

export function StickyCategoryBar({ activeCategory, onSelectCategory }: StickyCategoryBarProps) {
    return (
        <div className="sticky top-[138px] z-30 bg-background/95 backdrop-blur-md border-b border-border/40 py-3 transition-all">
            <div className="container mx-auto px-4 md:px-6 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-3 min-w-max">
                    {CATEGORIES.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <Button
                                key={cat.id}
                                variant="outline"
                                onClick={() => onSelectCategory(cat.id)}
                                className={cn(
                                    "rounded-full border px-6 h-9 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-[#00CDBC]/10 border-[#00CDBC] text-[#00CDBC] hover:bg-[#00CDBC]/20 hover:text-[#00CDBC]"
                                        : "bg-background border-border hover:border-foreground/50 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {cat.name}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
