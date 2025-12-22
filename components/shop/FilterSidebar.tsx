"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function FilterSidebar() {
    const [priceRange, setPriceRange] = useState([0, 200]);

    return (
        <div className="w-full h-full bg-background flex flex-col">
            <div className="p-4 border-b border-border">
                <h2 className="text-xl font-bold">Filters</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Sort By */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Sort By</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="justify-start">Recommended</Button>
                        <Button variant="outline" size="sm" className="justify-start">Price: Low to High</Button>
                        <Button variant="outline" size="sm" className="justify-start">Price: High to Low</Button>
                        <Button variant="outline" size="sm" className="justify-start">Newest</Button>
                    </div>
                </div>

                <Accordion type="multiple" defaultValue={["category", "price", "strain"]} className="w-full">

                    {/* Categories */}
                    <AccordionItem value="category">
                        <AccordionTrigger className="text-sm font-bold">Category</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-1">
                                {["Flower", "Vapes", "Edibles", "Pre-rolls", "Concentrates"].map((cat) => (
                                    <div key={cat} className="flex items-center space-x-2">
                                        <Checkbox id={`cat-${cat}`} />
                                        <Label htmlFor={`cat-${cat}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {cat}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Price Range */}
                    <AccordionItem value="price">
                        <AccordionTrigger className="text-sm font-bold">Price</AccordionTrigger>
                        <AccordionContent>
                            <div className="pt-4 px-2 space-y-4">
                                <Slider
                                    defaultValue={[0, 200]}
                                    max={500}
                                    step={5}
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                    className="py-4"
                                />
                                <div className="flex justify-between text-sm text-muted-foreground font-medium">
                                    <span>${priceRange[0]}</span>
                                    <span>${priceRange[1]}+</span>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Strain Type */}
                    <AccordionItem value="strain">
                        <AccordionTrigger className="text-sm font-bold">Strain Type</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-1">
                                {["Indica", "Sativa", "Hybrid", "High CBD"].map((strain) => (
                                    <div key={strain} className="flex items-center space-x-2">
                                        <Checkbox id={`strain-${strain}`} />
                                        <Label htmlFor={`strain-${strain}`} className="text-sm font-medium leading-none">
                                            {strain}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Brand */}
                    <AccordionItem value="brand">
                        <AccordionTrigger className="text-sm font-bold">Brand</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-1">
                                {["Stiiizy", "Raw Garden", "Wyld", "Jeeter", "Alien Labs"].map((brand) => (
                                    <div key={brand} className="flex items-center space-x-2">
                                        <Checkbox id={`brand-${brand}`} />
                                        <Label htmlFor={`brand-${brand}`} className="text-sm font-medium leading-none">
                                            {brand}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-border bg-background grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">Reset</Button>
                <Button className="w-full bg-[#00CDBC] hover:bg-[#00CDBC]/90 text-white font-bold">
                    Show Results
                </Button>
            </div>
        </div>
    );
}
