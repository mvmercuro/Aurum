import { requireAdmin } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { RewardsManager } from "@/components/RewardsManager";

export const dynamic = 'force-dynamic';

export default async function AdminRewardsPage() {
  await requireAdmin();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rewards Program</h1>
          <p className="text-muted-foreground">
            Manage customer rewards and loyalty tiers
          </p>
        </div>

        <RewardsManager />
      </div>
    </DashboardLayout>
  );
}
