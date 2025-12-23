"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Package, Plus, Minus, RefreshCw } from "lucide-react";

interface Product {
  id: number;
  name: string;
  inventoryCount: number;
  priceCents: number;
  categoryName: string;
  isActive: boolean;
}

export function InventoryManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async (productId: number, newCount: number) => {
    if (newCount < 0) {
      toast.error("Inventory cannot be negative");
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}/inventory`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventoryCount: newCount }),
      });

      if (!response.ok) throw new Error("Failed to update inventory");

      // Update local state
      setProducts(prev =>
        prev.map(p =>
          p.id === productId ? { ...p, inventoryCount: newCount } : p
        )
      );

      toast.success("Inventory updated");
    } catch (error) {
      console.error("Failed to update inventory:", error);
      toast.error("Failed to update inventory");
    }
  };

  const adjustInventory = (productId: number, delta: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    updateInventory(productId, product.inventoryCount + delta);
  };

  const getStockBadge = (count: number) => {
    if (count === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (count <= 5) {
      return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Low Stock</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">In Stock</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading inventory...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventory Management
        </CardTitle>
        <Button variant="outline" size="sm" onClick={fetchProducts} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-card"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-semibold">{product.name}</h4>
                  {getStockBadge(product.inventoryCount)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.categoryName} • ${(product.priceCents / 100).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustInventory(product.id, -1)}
                  disabled={product.inventoryCount === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <Input
                  type="number"
                  value={product.inventoryCount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    updateInventory(product.id, value);
                  }}
                  className="w-20 text-center"
                  min="0"
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustInventory(product.id, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
