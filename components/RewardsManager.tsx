"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, Users, Star } from "lucide-react";
import { toast } from "sonner";

interface RewardsMember {
  id: number;
  customerId: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  pointsBalance: number;
  lifetimePoints: number;
  isActive: boolean;
  joinedAt: string;
  lastActivityAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  lifetimeValueCents: number;
  totalOrders: number;
}

const tierColors = {
  bronze: "bg-orange-700",
  silver: "bg-slate-400",
  gold: "bg-yellow-500",
  platinum: "bg-purple-600",
};

const tierIcons = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  platinum: "💎",
};

export function RewardsManager() {
  const [members, setMembers] = useState<RewardsMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalPointsDistributed: 0,
    averageLifetimeValue: 0,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/rewards");
      if (!response.ok) throw new Error("Failed to fetch rewards members");

      const data = await response.json();

      // Check if data is an array (not an error object)
      if (!Array.isArray(data)) {
        console.error("API returned non-array data:", data);
        throw new Error(data.error || "Invalid response from server");
      }

      setMembers(data);

      // Calculate stats
      const totalMembers = data.length;
      const activeMembers = data.filter((m: RewardsMember) => m.isActive).length;
      const totalPointsDistributed = data.reduce(
        (sum: number, m: RewardsMember) => sum + m.lifetimePoints,
        0
      );
      const averageLifetimeValue =
        data.reduce((sum: number, m: RewardsMember) => sum + m.lifetimeValueCents, 0) /
        (totalMembers || 1);

      setStats({
        totalMembers,
        activeMembers,
        totalPointsDistributed,
        averageLifetimeValue,
      });
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load rewards members");
      setMembers([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold">{stats.totalMembers}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Award className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Members</p>
              <p className="text-2xl font-bold">{stats.activeMembers}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-2xl font-bold">{stats.totalPointsDistributed.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg LTV</p>
              <p className="text-2xl font-bold">
                ${(stats.averageLifetimeValue / 100).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-card border rounded-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Rewards Members</h2>
          <Button onClick={fetchMembers} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading members...
          </div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No rewards members yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Points Balance</TableHead>
                <TableHead>Lifetime Points</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Lifetime Value</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{member.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.customerPhone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={tierColors[member.tier]}>
                      {tierIcons[member.tier]} {member.tier.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {member.pointsBalance.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.lifetimePoints.toLocaleString()}
                  </TableCell>
                  <TableCell>{member.totalOrders}</TableCell>
                  <TableCell>
                    ${(member.lifetimeValueCents / 100).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {member.isActive ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-500/10">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
