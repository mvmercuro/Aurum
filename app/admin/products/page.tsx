import { requireAdmin } from "@/lib/auth";
import { ProductManager } from "@/components/ProductManager";
import DashboardLayout from "@/components/DashboardLayout";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
    await requireAdmin();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">
                        Manage your inventory, pricing, and product images
                    </p>
                </div>

                <ProductManager />
            </div>
        </DashboardLayout>
    );
}
