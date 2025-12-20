import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  priceCents: number;
  category: string;
}

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  priceCents: number;
}

export function ManualOrderDialog({ onOrderCreated }: { onOrderCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [regionInfo, setRegionInfo] = useState<{ regionName: string; deliveryFeeCents: number } | null>(null);

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    }
  };

  const checkZip = async (zipCode: string) => {
    if (zipCode.length !== 5) {
      setRegionInfo(null);
      return;
    }

    try {
      const response = await fetch("/api/orders/check-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: zipCode }),
      });

      if (response.ok) {
        const data = await response.json();
        setRegionInfo({
          regionName: data.regionName,
          deliveryFeeCents: data.deliveryFeeCents,
        });
      } else {
        setRegionInfo(null);
        toast.error("ZIP code not in service area");
      }
    } catch (error) {
      console.error("Failed to check ZIP:", error);
      setRegionInfo(null);
    }
  };

  const addItem = (productId: string) => {
    const product = products.find((p) => p.id === parseInt(productId));
    if (!product) return;

    const existingItem = items.find((i) => i.productId === product.id);
    if (existingItem) {
      setItems(
        items.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setItems([
        ...items,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          priceCents: product.priceCents,
        },
      ]);
    }
  };

  const removeItem = (productId: number) => {
    setItems(items.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setItems(items.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = regionInfo?.deliveryFeeCents || 0;
    return subtotal + deliveryFee;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    if (!regionInfo) {
      toast.error("Please enter a valid ZIP code in our service area");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          address1,
          address2,
          city,
          zip,
          items,
          paymentMethod,
          notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Order ${data.orderNumber} created successfully!`);
        setOpen(false);
        resetForm();
        onOrderCreated();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setItems([]);
    setCustomerName("");
    setCustomerPhone("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setZip("");
    setNotes("");
    setPaymentMethod("cash");
    setRegionInfo(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Manual Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Manual Order (Phone Order)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address1">Address Line 1 *</Label>
              <Input
                id="address1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="address2">Address Line 2 (Apt, Unit, etc.)</Label>
              <Input
                id="address2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  id="zip"
                  value={zip}
                  onChange={(e) => {
                    setZip(e.target.value);
                    checkZip(e.target.value);
                  }}
                  maxLength={5}
                  required
                />
                {regionInfo && (
                  <p className="text-xs text-green-500 mt-1">
                    ✓ {regionInfo.regionName} - ${(regionInfo.deliveryFeeCents / 100).toFixed(2)} delivery
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold">Order Items</h3>
            <div>
              <Label htmlFor="product">Add Product</Label>
              <Select onValueChange={addItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} - ${(product.priceCents / 100).toFixed(2)} ({product.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {items.length > 0 && (
              <div className="border rounded-lg p-4 space-y-2">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between gap-4">
                    <span className="flex-1 text-sm">{item.productName}</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm w-20 text-right">
                        ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${(calculateSubtotal() / 100).toFixed(2)}</span>
                  </div>
                  {regionInfo && (
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee:</span>
                      <span>${(regionInfo.deliveryFeeCents / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${(calculateTotal() / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment & Notes */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="payment">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash on Delivery</SelectItem>
                  <SelectItem value="debit">Debit on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special instructions, gate code, etc."
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || items.length === 0 || !regionInfo} className="flex-1">
              {loading ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
