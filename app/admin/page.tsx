import { requireAdmin } from "@/lib/auth";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, Map } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await requireAdmin();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name || user.email}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/orders" className="block text-inherit no-underline">
            <div className="rounded-lg border border-border bg-card p-6 h-full hover:border-primary/50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Orders
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage customer orders and deliveries
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Orders
              </Button>
            </div>
          </Link>

          <Link href="/admin/products" className="block text-inherit no-underline">
            <div className="rounded-lg border border-border bg-card p-6 h-full hover:border-primary/50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Products
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage inventory and product catalog
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Manage Products
              </Button>
            </div>
          </Link>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-2">Delivery Zones</h3>
            <p className="text-sm text-muted-foreground">
              Configure delivery areas and fees
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
