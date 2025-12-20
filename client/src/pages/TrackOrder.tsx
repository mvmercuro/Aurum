import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle, Truck, Search } from "lucide-react";
import { toast } from "sonner";

interface OrderStatus {
  orderNumber: string;
  status: string;
  customerName: string;
  totalCents: number;
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
  }>;
}

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(`/api/orders/${orderNumber}?phone=${encodeURIComponent(phone)}`);
      
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        setOrder(null);
        toast.error("Order not found. Please check your order number and phone number.");
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
      toast.error("Failed to fetch order");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; icon: any; color: string }> = {
      new: { label: "Order Received", icon: Clock, color: "text-blue-500" },
      accepted: { label: "Order Accepted", icon: CheckCircle, color: "text-green-500" },
      preparing: { label: "Preparing Your Order", icon: Package, color: "text-orange-500" },
      out_for_delivery: { label: "Out for Delivery", icon: Truck, color: "text-purple-500" },
      delivered: { label: "Delivered", icon: CheckCircle, color: "text-green-600" },
      canceled: { label: "Canceled", icon: Clock, color: "text-red-500" },
    };

    return statusMap[status] || statusMap.new;
  };

  const statusInfo = order ? getStatusInfo(order.status) : null;
  const StatusIcon = statusInfo?.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Track Your Order
            </h1>
            <p className="text-muted-foreground">
              Enter your order number and phone number to check your delivery status
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Lookup</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Order Number</label>
                  <Input
                    placeholder="e.g., SFV12345678"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? "Searching..." : "Track Order"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {searched && order && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">Order #{order.orderNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className={`${statusInfo?.color} gap-2`}>
                    {StatusIcon && <StatusIcon className="h-4 w-4" />}
                    {statusInfo?.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Progress Timeline */}
                  <div className="space-y-4">
                    <div className={`flex items-center gap-3 ${["new", "accepted", "preparing", "out_for_delivery", "delivered"].includes(order.status) ? "text-foreground" : "text-muted-foreground"}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${["new", "accepted", "preparing", "out_for_delivery", "delivered"].includes(order.status) ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Order Received</p>
                        <p className="text-sm text-muted-foreground">We've received your order</p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 ${["accepted", "preparing", "out_for_delivery", "delivered"].includes(order.status) ? "text-foreground" : "text-muted-foreground"}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${["accepted", "preparing", "out_for_delivery", "delivered"].includes(order.status) ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Order Accepted</p>
                        <p className="text-sm text-muted-foreground">Your order has been confirmed</p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 ${["preparing", "out_for_delivery", "delivered"].includes(order.status) ? "text-foreground" : "text-muted-foreground"}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${["preparing", "out_for_delivery", "delivered"].includes(order.status) ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Preparing</p>
                        <p className="text-sm text-muted-foreground">We're getting your order ready</p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 ${["out_for_delivery", "delivered"].includes(order.status) ? "text-foreground" : "text-muted-foreground"}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${["out_for_delivery", "delivered"].includes(order.status) ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <Truck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Out for Delivery</p>
                        <p className="text-sm text-muted-foreground">Your driver is on the way</p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 ${order.status === "delivered" ? "text-foreground" : "text-muted-foreground"}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${order.status === "delivered" ? "bg-green-600 text-white" : "bg-muted"}`}>
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Delivered</p>
                        <p className="text-sm text-muted-foreground">Enjoy your order!</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    <ul className="space-y-2">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.productName}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${(order.totalCents / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {searched && !order && !loading && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No order found. Please check your order number and phone number.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
