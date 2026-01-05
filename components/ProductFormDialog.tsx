"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  priceCents: number;
  imageUrl: string | null;
  categoryId: number;
  inventoryCount: number;
  thcPercentage: string | null;
  cbdPercentage: string | null;
  strainType: "indica" | "sativa" | "hybrid" | null;
  brand: string | null;
  weight: string | null;
  effects: string | null;
  isActive: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categories: Category[];
  onSaved: () => void;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  onSaved,
}: ProductFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceCents: 0,
    categoryId: "",
    inventoryCount: 0,
    thcPercentage: "",
    cbdPercentage: "",
    strainType: "",
    brand: "",
    weight: "3.5g",
    effects: "",
    isActive: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        priceCents: product.priceCents,
        categoryId: product.categoryId.toString(),
        inventoryCount: product.inventoryCount,
        thcPercentage: product.thcPercentage || "",
        cbdPercentage: product.cbdPercentage || "",
        strainType: product.strainType || "",
        brand: product.brand || "",
        weight: product.weight || "3.5g",
        effects: product.effects || "",
        isActive: product.isActive,
      });
      setImagePreview(product.imageUrl);
    } else {
      // Reset form for new product
      setFormData({
        name: "",
        description: "",
        priceCents: 0,
        categoryId: categories[0]?.id.toString() || "",
        inventoryCount: 0,
        thcPercentage: "",
        cbdPercentage: "",
        strainType: "",
        brand: "",
        weight: "3.5g",
        effects: "",
        isActive: true,
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [product, categories, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = product?.imageUrl || null;

      // Upload image if a new one was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch("/api/admin/products/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error("Failed to upload image");

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      // Prepare product data with explicit type conversions
      const productData = {
        name: formData.name,
        description: formData.description || null,
        priceCents: Math.round(Number(formData.priceCents)),
        imageUrl,
        categoryId: Number(formData.categoryId),
        inventoryCount: Math.round(Number(formData.inventoryCount)),
        thcPercentage: formData.thcPercentage || null,
        cbdPercentage: formData.cbdPercentage || null,
        strainType: formData.strainType || null,
        brand: formData.brand || null,
        weight: formData.weight || null,
        effects: formData.effects ? formData.effects.split(',').map(e => e.trim()).filter(Boolean) : [],
        isActive: formData.isActive,
      };

      // Create or update product
      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Failed to save product");

      toast.success(product ? "Product updated successfully" : "Product created successfully");
      onSaved();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-secondary/20">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute top-1 right-1 p-1 bg-background/80 rounded-full hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label htmlFor="image" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>{imagePreview ? "Change Image" : "Upload Image"}</span>
                  </div>
                </Label>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={(formData.priceCents / 100).toFixed(2)}
                onChange={(e) =>
                  setFormData({ ...formData, priceCents: Math.round(parseFloat(e.target.value) * 100) })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inventory">Inventory Count *</Label>
              <Input
                id="inventory"
                type="number"
                value={formData.inventoryCount}
                onChange={(e) =>
                  setFormData({ ...formData, inventoryCount: parseInt(e.target.value) || 0 })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strainType">Strain Type</Label>
              <Select
                value={formData.strainType}
                onValueChange={(value) => setFormData({ ...formData, strainType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select strain type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indica">Indica</SelectItem>
                  <SelectItem value="sativa">Sativa</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thc">THC %</Label>
              <Input
                id="thc"
                type="number"
                step="0.01"
                value={formData.thcPercentage}
                onChange={(e) => setFormData({ ...formData, thcPercentage: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cbd">CBD %</Label>
              <Input
                id="cbd"
                type="number"
                step="0.01"
                value={formData.cbdPercentage}
                onChange={(e) => setFormData({ ...formData, cbdPercentage: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="e.g., 3.5g"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="effects">Effects (comma-separated)</Label>
              <Input
                id="effects"
                value={formData.effects}
                onChange={(e) => setFormData({ ...formData, effects: e.target.value })}
                placeholder="e.g., Relaxed, Happy, Euphoric"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
