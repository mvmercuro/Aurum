import { useEffect, useState } from "react";
import { useLocation } from "wouter";
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
import { Package, Clock, CheckCircle, XCircle, Truck, LogOut, Printer } from "lucide-react";
import { toast } from "sonner";
import { ManualOrderDialog } from "@/components/ManualOrderDialog";
import { InventoryManager } from "@/components/InventoryManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("orders");

  // Check authentication
  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

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

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast.success("Logged out successfully");
    setLocation("/admin/login");
  };

  const handlePrintReceipt = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Receipt - ${order.orderNumber}</title>
        <style>
          body { font-family: monospace; padding: 20px; max-width: 400px; margin: 0 auto; }
          h1 { font-size: 18px; text-align: center; margin-bottom: 20px; }
          .header { border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
          .section { margin: 15px 0; }
          .label { font-weight: bold; }
          .items { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0; margin: 10px 0; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; }
          .totals { margin-top: 10px; }
          .total-line { display: flex; justify-content: space-between; margin: 3px 0; }
          .grand-total { font-weight: bold; font-size: 16px; border-top: 2px solid #000; padding-top: 5px; margin-top: 5px; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SFV PREMIUM CANNABIS</h1>
          <div style="text-align: center;">Delivery Receipt</div>
        </div>
        
        <div class="section">
          <div><span class="label">Order #:</span> ${order.orderNumber}</div>
          <div><span class="label">Date:</span> ${new Date(order.createdAt).toLocaleString()}</div>
          <div><span class="label">Status:</span> ${order.status}</div>
        </div>

        <div class="section">
          <div class="label">Customer:</div>
          <div>${order.customerName}</div>
          <div>${order.customerPhone}</div>
        </div>

        <div class="section">
          <div class="label">Delivery Address:</div>
          <div>${order.address1}</div>
          ${order.address2 ? `<div>${order.address2}</div>` : ""}
          <div>${order.city}, CA ${order.zip}</div>
          <div>${order.regionName} Region</div>
        </div>

        ${order.assignment ? `
        <div class="section">
          <div class="label">Driver:</div>
          <div>${order.assignment.driverName}</div>
        </div>
        ` : ""}

        <div class="items">
          <div class="label">Items:</div>
          ${order.items.map(item => `
            <div class="item">
              <span>${item.quantity}x ${item.productName}</span>
              <span>$${((item.priceCentsAtPurchase * item.quantity) / 100).toFixed(2)}</span>
            </div>
          `).join("")}
        </div>

        <div class="totals">
          <div class="total-line">
            <span>Subtotal:</span>
            <span>$${(order.subtotalCents / 100).toFixed(2)}</span>
          </div>
          <div class="total-line">
            <span>Delivery Fee:</span>
            <span>$${(order.deliveryFeeCents / 100).toFixed(2)}</span>
          </div>
          <div class="total-line grand-total">
            <span>TOTAL:</span>
            <span>$${(order.totalCents / 100).toFixed(2)}</span>
          </div>
        </div>

        <div class="section">
          <div class="label">Payment Method:</div>
          <div>${order.paymentMethod === "cash" ? "Cash on Delivery" : "Debit on Delivery"}</div>
        </div>

        ${order.notes ? `
        <div class="section">
          <div class="label">Notes:</div>
          <div>${order.notes}</div>
        </div>
        ` : ""}

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #000;">
          <div>Thank you for choosing SFV Premium!</div>
          <div style="font-size: 10px; margin-top: 10px;">License # C9-0000000-LIC</div>
        </div>

        <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; width: 100%; cursor: pointer;">Print Receipt</button>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
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
          <div className="flex gap-3">
            <ManualOrderDialog onOrderCreated={fetchOrders} />
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
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
            <div>
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
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <div className="flex gap-4">
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
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => handlePrintReceipt(order)}
                    >
                      <Printer className="h-4 w-4" />
                      Print Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
