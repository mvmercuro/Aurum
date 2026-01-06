"use client";

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
import { Plus, X, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";

interface Product {
  id: number;
  name: string;
  priceCents: number;
  category?: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  zip?: string | null;
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");

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
      fetchCustomers();
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

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/admin/customers");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast.error("Failed to load customers");
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);

    if (!customerId) {
      // Clear customer info if deselected
      return;
    }

    const customer = customers.find((c) => c.id.toString() === customerId);
    if (customer) {
      setCustomerName(customer.name);
      setCustomerPhone(customer.phone);
      setAddress1(customer.address1 || "");
      setAddress2(customer.address2 || "");
      setCity(customer.city || "");
      setZip(customer.zip || "");

      if (customer.zip) {
        checkZip(customer.zip);
      }
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
    if (!productId) return;

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

    // Reset product selection
    setSelectedProductId("");
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
    const deliveryFee = subtotal >= 10000 ? 0 : (regionInfo?.deliveryFeeCents ?? 0);
    return subtotal + deliveryFee;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Please add at least one product to the order");
      return;
    }

    if (!regionInfo) {
      toast.error("Valid Delivery ZIP Code Required", {
        description: "Please enter a 5-digit ZIP code inside our service area."
      });
      if (zip.length === 5) checkZip(zip);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomerId ? parseInt(selectedCustomerId) : undefined,
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
    setSelectedCustomerId("");
    setSelectedProductId("");
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

  // Convert products to combobox options
  const productOptions: ComboboxOption[] = products.map((product) => ({
    value: product.id.toString(),
    label: product.name,
    metadata: `$${(product.priceCents / 100).toFixed(2)}${product.category ? ` • ${product.category}` : ""}`,
  }));

  // Convert customers to combobox options
  const customerOptions: ComboboxOption[] = customers.map((customer) => ({
    value: customer.id.toString(),
    label: customer.name,
    metadata: customer.phone,
  }));

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
          {/* Customer Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Customer</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open("/admin/customers", "_blank")}
                className="gap-1"
              >
                <UserPlus className="h-3 w-3" />
                New Customer
              </Button>
            </div>
            <div>
              <Label>Select Existing Customer (Optional)</Label>
              <Combobox
                options={customerOptions}
                value={selectedCustomerId}
                onValueChange={handleCustomerSelect}
                placeholder="Search customers..."
                searchPlaceholder="Type to search by name or phone..."
                emptyMessage="No customers found"
              />
              {selectedCustomerId && (
                <p className="text-xs text-muted-foreground mt-1">
                  Customer selected - info auto-filled below
                </p>
              )}
            </div>
          </div>

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
                    {calculateSubtotal() >= 10000 && " (waived for orders $100+)"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold">Order Items</h3>
            <div>
              <Label>Add Product</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Combobox
                    options={productOptions}
                    value={selectedProductId}
                    onValueChange={setSelectedProductId}
                    placeholder="Search products..."
                    searchPlaceholder="Type to search products..."
                    emptyMessage="No products found"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => addItem(selectedProductId)}
                  disabled={!selectedProductId}
                >
                  Add
                </Button>
              </div>
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
                      <span>
                        {calculateSubtotal() >= 10000 ? (
                          <span className="text-green-600">FREE (over $100)</span>
                        ) : (
                          `$${((regionInfo.deliveryFeeCents || 0) / 100).toFixed(2)}`
                        )}
                      </span>
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
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
