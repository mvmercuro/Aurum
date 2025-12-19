import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = ["Flower", "Pre-rolls", "Vape", "Edibles", "Concentrates"];
  const brands = ["Aurum Farms", "Pacific Stone", "Connected", "Heavy Hitters", "Valley Grown"];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container py-8">
        {/* Mobile Header & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold">Menu</h1>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search strains, brands..." 
                className="pl-9 bg-secondary/20 border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="md:hidden">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden md:block space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Filters</h3>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary" onClick={() => setSelectedCategories([])}>
                Reset
              </Button>
            </div>

            <Accordion type="multiple" defaultValue={["category", "brand"]} className="w-full">
              <AccordionItem value="category" className="border-border/50">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">Category</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {categories.map((cat) => (
                      <div key={cat} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`cat-${cat}`} 
                          checked={selectedCategories.includes(cat)}
                          onCheckedChange={() => toggleCategory(cat)}
                        />
                        <Label htmlFor={`cat-${cat}`} className="text-sm font-normal cursor-pointer">{cat}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="brand" className="border-border/50">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">Brand</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox id={`brand-${brand}`} />
                        <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">{brand}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="price" className="border-border/50">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">Price</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-1" />
                      <Label htmlFor="price-1" className="text-sm font-normal">Under $25</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-2" />
                      <Label htmlFor="price-2" className="text-sm font-normal">$25 - $50</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-3" />
                      <Label htmlFor="price-3" className="text-sm font-normal">$50 - $100</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-4" />
                      <Label htmlFor="price-4" className="text-sm font-normal">$100+</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Product Grid */}
          <div className="md:col-span-3">
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
              <Button 
                variant={selectedCategories.length === 0 ? "default" : "outline"} 
                size="sm" 
                className="rounded-full px-6"
                onClick={() => setSelectedCategories([])}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button 
                  key={cat}
                  variant={selectedCategories.includes(cat) ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full px-6 whitespace-nowrap"
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filteredProducts.length} results
            </p>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
                <Button variant="link" onClick={() => {setSearchQuery(""); setSelectedCategories([]);}}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
