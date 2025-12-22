import { requireAdmin } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";

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
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-2">Orders</h3>
            <p className="text-sm text-muted-foreground">
              Manage customer orders and deliveries
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-2">Products</h3>
            <p className="text-sm text-muted-foreground">
              Manage inventory and product catalog
            </p>
          </div>

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
