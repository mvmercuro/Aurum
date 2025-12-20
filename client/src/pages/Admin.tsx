import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import { toast } from "sonner";
import { ManualOrderDialog } from "@/components/ManualOrderDialog";

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  priceCentsAtPurchase: number;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address1: string;
  address2: string | null;
  city: string;
  zip: string;
  status: string;
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  paymentMethod: string;
  notes: string | null;
  createdAt: string;
  regionName: string;
  items: OrderItem[];
  assignment: {
    driverId: number;
    driverName: string;
    assignedAt: string;
  } | null;
}

interface Driver {
  id: number;
  name: string;
  phone: string;
  isActive: boolean;
}

export default function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
    fetchDrivers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch("/api/admin/drivers");
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    }
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Order status updated");
        fetchOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const assignDriver = async (orderId: number, driverId: number) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId }),
      });

      if (response.ok) {
        toast.success("Driver assigned");
        fetchOrders();
      } else {
        toast.error("Failed to assign driver");
      }
    } catch (error) {
      console.error("Failed to assign driver:", error);
      toast.error("Failed to assign driver");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      new: { variant: "default", icon: Clock },
      accepted: { variant: "secondary", icon: CheckCircle },
      preparing: { variant: "secondary", icon: Package },
      out_for_delivery: { variant: "default", icon: Truck },
      delivered: { variant: "outline", icon: CheckCircle },
      canceled: { variant: "destructive", icon: XCircle },
    };

    const config = variants[status] || variants.new;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === "new").length,
    active: orders.filter(o => ["accepted", "preparing", "out_for_delivery"].includes(o.status)).length,
    delivered: orders.filter(o => o.status === "delivered").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage orders and deliveries</p>
          </div>
          <ManualOrderDialog onOrderCreated={fetchOrders} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.new}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-500">{stats.active}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">{stats.delivered}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No orders found
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold mb-1">
                        Order #{order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div>
                      <h4 className="font-semibold mb-2">Customer</h4>
                      <p className="text-sm">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {order.address1}
                        {order.address2 && `, ${order.address2}`}
                        <br />
                        {order.city}, CA {order.zip}
                      </p>
                      <p className="text-sm font-semibold mt-2">Region: {order.regionName}</p>
                    </div>

                    {/* Order Details */}
                    <div>
                      <h4 className="font-semibold mb-2">Items</h4>
                      <ul className="text-sm space-y-1 mb-4">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{item.quantity}x {item.productName}</span>
                            <span>${(item.priceCentsAtPurchase / 100).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t pt-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${(order.subtotalCents / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery Fee:</span>
                          <span>${(order.deliveryFeeCents / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <span>${(order.totalCents / 100).toFixed(2)}</span>
                        </div>
                        <p className="text-muted-foreground">Payment: {order.paymentMethod}</p>
                      </div>
                      {order.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Notes:</strong> {order.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Assign Driver</label>
                      <Select
                        value={order.assignment?.driverId.toString() || ""}
                        onValueChange={(value) => assignDriver(order.id, parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id.toString()}>
                              {driver.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {order.assignment && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Currently: {order.assignment.driverName}
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Update Status</label>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateStatus(order.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="canceled">Canceled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
