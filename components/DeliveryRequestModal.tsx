import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ordersApi, Product } from "@/lib/api";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface DeliveryRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export function DeliveryRequestModal({ open, onOpenChange, product }: DeliveryRequestModalProps) {
  const [step, setStep] = useState<"form" | "validating" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address1: "",
    address2: "",
    city: "",
    zip: "",
    notes: "",
    quantity: 1,
    paymentMethod: "cash" as "cash" | "debit",
  });

  const [zipInfo, setZipInfo] = useState<{
    available: boolean;
    regionName?: string;
    deliveryFeeCents?: number;
    minimumOrderCents?: number;
  } | null>(null);

  const handleZipCheck = async (zip: string) => {
    if (zip.length === 5) {
      try {
        const result = await ordersApi.checkZip(zip);
        setZipInfo(result);
        if (!result.available) {
          toast.error("Sorry, we don't deliver to this ZIP code yet");
        } else {
          toast.success(`Great! We deliver to ${result.regionName}`);
        }
      } catch (error) {
        console.error("ZIP check failed:", error);
        toast.error("Failed to validate ZIP code");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zipInfo?.available) {
      toast.error("Please enter a valid delivery ZIP code");
      return;
    }

    const subtotal = product.priceCents * formData.quantity;
    if (zipInfo.minimumOrderCents && subtotal < zipInfo.minimumOrderCents) {
      toast.error(`Minimum order for ${zipInfo.regionName} is $${(zipInfo.minimumOrderCents / 100).toFixed(2)}`);
      return;
    }

    setLoading(true);
    setStep("validating");

    try {
      const result = await ordersApi.create({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        address1: formData.address1,
        address2: formData.address2 || undefined,
        city: formData.city,
        zip: formData.zip,
        notes: formData.notes || undefined,
        items: [
          {
            productId: product.id,
            quantity: formData.quantity,
          },
        ],
        paymentMethod: formData.paymentMethod,
      });

      setOrderNumber(result.orderNumber);
      setStep("success");
      toast.success("Delivery request submitted!");
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to submit delivery request");
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    setFormData({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      address1: "",
      address2: "",
      city: "",
      zip: "",
      notes: "",
      quantity: 1,
      paymentMethod: "cash",
    });
    setZipInfo(null);
    setOrderNumber("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">Request Delivery</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {product.name} - ${(product.priceCents / 100).toFixed(2)}
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    placeholder="(818) 555-0100"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address1">Street Address *</Label>
                <Input
                  id="address1"
                  required
                  placeholder="123 Main St"
                  value={formData.address1}
                  onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address2">Apt, Suite, etc. (Optional)</Label>
                <Input
                  id="address2"
                  placeholder="Apt 4B"
                  value={formData.address2}
                  onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code *</Label>
                  <Input
                    id="zip"
                    required
                    maxLength={5}
                    placeholder="91364"
                    value={formData.zip}
                    onChange={(e) => {
                      setFormData({ ...formData, zip: e.target.value });
                      handleZipCheck(e.target.value);
                    }}
                  />
                  {zipInfo && zipInfo.available && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Delivers to {zipInfo.regionName} (+${(zipInfo.deliveryFeeCents! / 100).toFixed(2)} fee)
                    </p>
                  )}
                  {zipInfo && !zipInfo.available && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Not available in this area
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  max={10}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Gate code, special instructions, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as "cash" | "debit" })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="font-normal cursor-pointer">Cash on Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="debit" id="debit" />
                    <Label htmlFor="debit" className="font-normal cursor-pointer">Debit on Delivery</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="pt-4 space-y-2">
                <Button type="submit" className="w-full" disabled={loading || !zipInfo?.available}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Request"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  We'll call you to confirm your order and delivery time
                </p>
              </div>
            </form>
          </>
        )}

        {step === "validating" && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg font-medium">Processing your request...</p>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-500/10 p-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold">Request Received!</h3>
              <p className="text-muted-foreground">
                Your order number is <span className="font-mono font-bold text-foreground">{orderNumber}</span>
              </p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-medium">What happens next?</p>
              <ol className="text-left space-y-1 text-muted-foreground">
                <li>1. We'll call you to confirm your order</li>
                <li>2. Your driver will be assigned</li>
                <li>3. You'll receive delivery within 45-60 minutes</li>
                <li>4. Driver will verify your ID and collect payment</li>
              </ol>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
