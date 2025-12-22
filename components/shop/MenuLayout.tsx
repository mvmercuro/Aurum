"use client";

import { useState } from "react";
import { StickyCategoryBar } from "./StickyCategoryBar";
import { FilterSidebar } from "./FilterSidebar";
import { ProductCardList, ProductWithCategory } from "./ProductCardList";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MenuLayoutProps {
    products: ProductWithCategory[];
}

export function MenuLayout({ products }: MenuLayoutProps) {
    const [activeCategory, setActiveCategory] = useState("all");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F7F7F7]">
            {/* 
        Sticky Header Row (Search & Filter) 
        - Positioned below the main site header (assuming main header is ~64px-80px? 
          We'll use standard sticky positioning, maybe top-0 for now or offset if Layout has a fixed header)
        - For now, let's assume it sticks to the top or just below the navbar. 
          If the main Navbar is sticky, we need `top-[64px]`. I'll verify logic later.
      */}
            <div className="sticky top-0 sm:top-[70px] z-40 bg-background border-b border-border/50 shadow-sm transition-all">
                <div className="container mx-auto px-4 md:px-6 h-[68px] flex items-center justify-between gap-4">

                    {/* Expanded Search Bar */}
                    {isSearchOpen ? (
                        <div className="flex items-center w-full gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
                            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <Input
                                autoFocus
                                placeholder="Search this menu..."
                                className="flex-1 border-none shadow-none focus-visible:ring-0 text-lg h-12 bg-transparent px-0"
                            />
                            <Button
                                variant="ghost"
                                onClick={() => setIsSearchOpen(false)}
                                className="text-muted-foreground hover:text-foreground hover:bg-transparent font-medium"
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Left Controls: Search & Filter */}
                            <div className="flex items-center gap-2 md:gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-secondary"
                                    onClick={() => setIsSearchOpen(true)}
                                >
                                    <Search className="w-5 h-5" />
                                </Button>

                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="rounded-full border-border/60 gap-2 font-semibold hover:border-[#00CDBC] hover:text-[#00CDBC] transition-colors"
                                        >
                                            <SlidersHorizontal className="w-4 h-4" />
                                            Filters
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[350px] sm:w-[400px] p-0 border-r border-border">
                                        <FilterSidebar />
                                    </SheetContent>
                                </Sheet>
                            </div>

                            {/* Right: Category Chips (Short list or maybe hidden on mobile if StickyCategoryBar handles it?)
                  Actually, existing design has search/filter LEFT, and then the StickyCategoryBar is BELOW this row.
                  So this row is just tools.
              */}
                            <div className="hidden md:flex items-center text-sm text-muted-foreground font-medium">
                                {products.length} Products
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Sticky Category Bar (Sticks below the tool bar) */}
            {/* Note: top needs to account for Navbar + ToolBar. 
          Assuming Navbar ~70px, Toolbar ~68px -> top ~138px. 
      */}
            <StickyCategoryBar
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
            />

            {/* Main Content Area */}
            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCardList key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
