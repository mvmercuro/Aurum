import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, ShieldCheck, Share2, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Product, productsApi } from "@/lib/api";
import { DeliveryRequestModal } from "@/components/DeliveryRequestModal";

export default function ProductDetail() {
  const [match, params] = useRoute("/product/:id");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await productsApi.getAll();
        const found = products.find((p: Product) => p.id === parseInt(params?.id || "0"));
        setProduct(found || null);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [params?.id]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </Layout>
    );
  }

  const price = (product.priceCents / 100).toFixed(2);
  const imageUrl = product.imageUrl || "/images/flower-category.jpg";
  const isOutOfStock = product.inventoryCount === 0;
  const isLowStock = product.inventoryCount > 0 && product.inventoryCount < 5;

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/10 border border-border/50 relative group">
              <img 
                src={imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-6 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
              <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="absolute top-4 right-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="uppercase text-xs tracking-wider">
                  Premium
                </Badge>
                {product.strainType && (
                  <Badge variant="outline" className="uppercase text-xs">
                    {product.strainType}
                  </Badge>
                )}
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.7 (128 reviews)</span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3">
                {isOutOfStock && (
                  <Badge variant="destructive" className="text-sm">
                    Out of Stock
                  </Badge>
                )}
                {isLowStock && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 text-sm">
                    Only {product.inventoryCount} left!
                  </Badge>
                )}
                {!isOutOfStock && !isLowStock && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-600 border-green-500/30 text-sm">
                    In Stock
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">About This Product</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || `Premium ${product.name} - carefully cultivated and lab-tested for quality and potency. Experience the finest cannabis the Valley has to offer.`}
              </p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4">
              {product.thcPercentage && (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">THC Content</p>
                  <p className="text-2xl font-bold text-primary">{product.thcPercentage}%</p>
                </div>
              )}
              {product.cbdPercentage && (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">CBD Content</p>
                  <p className="text-2xl font-bold text-primary">{product.cbdPercentage}%</p>
                </div>
              )}
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Weight</p>
                <p className="text-lg font-semibold">{product.weight || "3.5g"}</p>
              </div>
              {product.brand && (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Brand</p>
                  <p className="text-lg font-semibold">{product.brand}</p>
                </div>
              )}
            </div>

            {/* Effects */}
            {product.effects && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Effects</h3>
                <p className="text-muted-foreground">{product.effects}</p>
              </div>
            )}

            {/* Price & Order */}
            <div className="space-y-6 pt-4 border-t border-border/50">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">${price}</span>
                <span className="text-muted-foreground mb-2">/ {product.weight || "3.5g"}</span>
              </div>

              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 h-14 text-lg shadow-lg shadow-primary/20"
                  onClick={() => setShowDeliveryModal(true)}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? "Out of Stock" : "Request Delivery"}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>60-90 Min Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Lab Tested</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeliveryRequestModal 
        open={showDeliveryModal} 
        onOpenChange={setShowDeliveryModal} 
        product={product} 
      />
    </Layout>
  );
}
