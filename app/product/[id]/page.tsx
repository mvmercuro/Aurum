import { Layout } from "@/components/Layout";
import { productsApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import Image from "next/image";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  let product;
  try {
    product = await productsApi.getById(parseInt(id));
  } catch (error) {
    notFound();
  }

  const price = (product.priceCents / 100).toFixed(2);
  const imageUrl = product.imageUrl || "/images/flower-category.jpg";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square overflow-hidden rounded-lg border border-border relative">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
                {product.brand || "Premium"}
              </p>
              <h1 className="text-4xl font-bold font-serif mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                {product.strainType && (
                  <Badge variant="secondary" className="text-sm">
                    {product.strainType.toUpperCase()}
                  </Badge>
                )}
                {product.inventoryCount > 0 ? (
                  <Badge variant="secondary" className="bg-green-500/80 text-green-950">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold">${price}</span>
              <span className="text-muted-foreground">{product.weight || "3.5g"}</span>
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/20 rounded-lg">
              {product.thcPercentage && (
                <div>
                  <p className="text-xs text-muted-foreground">THC</p>
                  <p className="text-xl font-bold">{product.thcPercentage}%</p>
                </div>
              )}
              {product.cbdPercentage && (
                <div>
                  <p className="text-xs text-muted-foreground">CBD</p>
                  <p className="text-xl font-bold">{product.cbdPercentage}%</p>
                </div>
              )}
            </div>

            {product.effects && product.effects.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Effects</h3>
                <div className="flex flex-wrap gap-2">
                  {product.effects.map((effect, i) => (
                    <Badge key={i} variant="outline">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              disabled={product.inventoryCount === 0}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              {product.inventoryCount === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
