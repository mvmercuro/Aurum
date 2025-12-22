"use client";

import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ordersApi } from "@/lib/api";
import { Package, MapPin, Clock, CheckCircle } from "lucide-react";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const result = await ordersApi.getByOrderNumber(orderNumber, phone);
      setOrder(result);
    } catch (err: any) {
      setError(err.response?.data?.error || "Order not found. Please check your order number and phone number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Package className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-4xl font-bold font-serif">Track Your Order</h1>
            <p className="text-xl text-muted-foreground">
              Enter your order details to check delivery status
            </p>
          </div>

          <form onSubmit={handleTrack} className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input
                id="orderNumber"
                placeholder="e.g., ORD-12345"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(818) 555-0123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/50 text-destructive rounded-lg p-4 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Tracking..." : "Track Order"}
            </Button>
          </form>

          {order && (
            <div className="bg-card border border-border rounded-lg p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Order {order.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold">
                  {order.status}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Delivery Address</p>
                    <p className="text-sm text-muted-foreground">
                      {order.address1}
                      {order.address2 && `, ${order.address2}`}
                      <br />
                      {order.city}, CA {order.zip}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Estimated Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      60-90 minutes from order confirmation
                    </p>
                  </div>
                </div>

                {order.status === "delivered" && (
                  <div className="flex items-start gap-4 text-green-600">
                    <CheckCircle className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-semibold">Delivered</p>
                      <p className="text-sm">
                        {new Date(order.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="font-semibold mb-2">Order Total</p>
                <p className="text-2xl font-bold">${'$'}{(order.totalCents / 100).toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
