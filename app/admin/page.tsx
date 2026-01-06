import { requireAdmin } from "@/lib/auth";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, MapPin, Award, Users } from "lucide-react";

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

          <Link href="/admin/customers" className="block text-inherit no-underline">
            <div className="rounded-lg border border-border bg-card p-6 h-full hover:border-primary/50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Customers
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                View and manage customer database
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Customers
              </Button>
            </div>
          </Link>

          <Link href="/admin/rewards" className="block text-inherit no-underline">
            <div className="rounded-lg border border-border bg-card p-6 h-full hover:border-primary/50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Rewards Program
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage loyalty tiers and points
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Manage Rewards
              </Button>
            </div>
          </Link>

          <Link href="/admin/delivery-zones" className="block text-inherit no-underline">
            <div className="rounded-lg border border-border bg-card p-6 h-full hover:border-primary/50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Delivery Zones
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure delivery areas and fees
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Manage Zones
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
