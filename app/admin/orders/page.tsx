import { getDb } from "@/lib/db";
import { orders } from "@/drizzle/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { OrderList } from "@/components/admin/OrderList";
import { ManualOrderDialog } from "@/components/ManualOrderDialog";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    await requireAdmin();
    const db = await getDb();

    // Clean empty state if DB connection fails
    if (!db) {
        return (
            <DashboardLayout>
                <div className="text-destructive">Database Connection Error</div>
            </DashboardLayout>
        )
    }

    const allOrders = await db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt));

    async function refreshOrders() {
        "use server";
        revalidatePath("/admin/orders");
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                        <p className="text-muted-foreground">
                            Manage incoming and active orders
                        </p>
                    </div>
                    <ManualOrderDialog onOrderCreated={refreshOrders} />
                </div>

                <OrderList orders={allOrders} />
            </div>
        </DashboardLayout>
    );
}
