import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, ShieldCheck, Share2, Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function ProductDetail() {
  const [match, params] = useRoute("/product/:id");
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === params?.id);

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/10 border border-border/50 relative group">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="absolute top-4 right-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Thumbnails (Mock) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-secondary/10 border border-border/50 cursor-pointer hover:border-primary transition-colors">
                  <img 
                    src={product.image} 
                    alt={`View ${i}`}
                    className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-primary uppercase tracking-wider">{product.brand}</span>
                {product.tags?.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px] h-5">{tag}</Badge>
                ))}
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-muted-foreground underline cursor-pointer">({product.reviews} reviews)</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <span className="text-muted-foreground">{product.category}</span>
                <div className="w-px h-4 bg-border" />
                <span className="font-medium text-primary">{product.type}</span>
              </div>
            </div>

            {/* Delivery Info Card */}
            <div className="p-4 rounded-xl bg-secondary/20 border border-border/50 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Delivery to San Fernando Valley</p>
                <p className="text-xs text-muted-foreground">ETA: 45-60 mins • Free delivery over $50</p>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="space-y-6 pt-4 border-t border-border/50">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">${product.price}</span>
                <span className="text-lg text-muted-foreground mb-1">/ {product.weight}</span>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center border border-border rounded-lg h-14 w-32 bg-background">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-full rounded-none hover:bg-transparent"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center font-medium text-lg">{quantity}</div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-full rounded-none hover:bg-transparent"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="lg" className="flex-1 h-14 text-lg shadow-lg shadow-primary/20">
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </Button>
              </div>
            </div>

            {/* Product Description Breakdown */}
            <div className="space-y-8 pt-8">
              <div>
                <h3 className="font-bold text-xl mb-4">Product Description</h3>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6 text-sm">
                  <div>
                    <span className="block text-muted-foreground mb-1 uppercase text-xs tracking-wider">Type</span>
                    <span className="font-medium text-lg">{product.type}</span>
                  </div>
                  <div>
                    <span className="block text-muted-foreground mb-1 uppercase text-xs tracking-wider">THC</span>
                    <span className="font-medium text-lg">{product.thc}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="block text-muted-foreground mb-2 uppercase text-xs tracking-wider">Effects</span>
                  <div className="flex flex-wrap gap-2">
                    {product.effects.map(effect => (
                      <Badge key={effect} variant="outline" className="px-3 py-1 text-sm border-primary/30 bg-primary/5 text-primary">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  <Button variant="link" className="px-0 text-primary h-auto mt-2">Read more</Button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border/50">
                <ShieldCheck className="h-4 w-4" />
                <span>California Residents: <span className="text-primary cursor-pointer hover:underline">Proposition 65 Warning</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
