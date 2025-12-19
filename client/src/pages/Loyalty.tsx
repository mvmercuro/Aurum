import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Gift, Star, Zap } from "lucide-react";

export default function Loyalty() {
  return (
    <Layout>
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-background z-0" />
        <div className="container relative z-10 py-20 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6 border border-primary/20">
            <Crown className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-400">
            The High Rollers Club
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Elevate your experience. Earn points on every order and unlock exclusive rewards, priority delivery, and members-only drops.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">Join for Free</Button>
            <Button size="lg" variant="outline" className="text-lg px-8">Sign In</Button>
          </div>
        </div>
      </div>

      <div className="container py-16 space-y-20">
        {/* How it Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <Zap className="h-10 w-10 text-yellow-400 mb-2" />
              <CardTitle>Earn Points</CardTitle>
              <CardDescription>Get 1 point for every $1 you spend.</CardDescription>
            </CardHeader>
            <CardContent>
              Every purchase brings you closer to your next reward. Points never expire for active members.
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <Gift className="h-10 w-10 text-pink-400 mb-2" />
              <CardTitle>Redeem Rewards</CardTitle>
              <CardDescription>Use points for products or discounts.</CardDescription>
            </CardHeader>
            <CardContent>
              Trade your points for top-shelf flower, edibles, or huge discounts on your entire cart.
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <Star className="h-10 w-10 text-purple-400 mb-2" />
              <CardTitle>VIP Status</CardTitle>
              <CardDescription>Unlock higher tiers for better perks.</CardDescription>
            </CardHeader>
            <CardContent>
              Climb the ranks to unlock free delivery, birthday gifts, and access to our "Vault" reserve menu.
            </CardContent>
          </Card>
        </div>

        {/* Tiers */}
        <div>
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Membership Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Silver */}
            <div className="rounded-2xl border border-border/50 bg-secondary/10 p-8 flex flex-col">
              <h3 className="text-2xl font-bold mb-2 text-slate-300">Silver</h3>
              <p className="text-sm text-muted-foreground mb-6">0 - 500 Points</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm"><span className="text-green-400">✓</span> 1 Point per $1 spent</li>
                <li className="flex items-center gap-2 text-sm"><span className="text-green-400">✓</span> Birthday Pre-roll</li>
                <li className="flex items-center gap-2 text-sm"><span className="text-green-400">✓</span> Monthly Newsletter</li>
              </ul>
              <Button variant="secondary" className="w-full">Current Status</Button>
            </div>

            {/* Gold */}
            <div className="rounded-2xl border border-primary/50 bg-primary/5 p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-primary/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2 text-yellow-400">Gold</h3>
              <p className="text-sm text-muted-foreground mb-6">500 - 2000 Points</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm"><span className="text-green-400">✓</span> 1.5 Points per $1 spent</li>
                <li className="flex items-center gap-2 text-sm"><span className="text-green-400">✓</span> Birthday 1/8th</li>
                <li className="flex items-center gap-2 text-sm"><span className="text-green-400">✓</span> Free Delivery (No Minimum)</li>
                <li className="flex items-center gap-2 text-sm"><span className="text-green-400">✓</span> Early Access to Drops</li>
              </ul>
              <Button className="w-full">Unlock Gold</Button>
            </div>

            {/* Platinum */}
            <div className="rounded-2xl border border-border/50 bg-secondary/10 p-8 flex flex-col">
              <h3 className="text-2xl font-bold mb-2 text-purple-400">Platinum</h3>
              <p className="text-sm text-muted-foreground mb-6">2000+ Points</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm"><span className="text-green-400">✓</span> 2 Points per $1 spent</li>
                <li className="flex items-center gap-2 text-sm"><span className="text-green-400">✓</span> Birthday "Goody Bag" ($100 value)</li>
                <li className="flex items-center gap-2 text-sm"><span className="text-green-400">✓</span> Priority Dispatch</li>
                <li className="flex items-center gap-2 text-sm"><span className="text-green-400">✓</span> Dedicated Concierge Line</li>
                <li className="flex items-center gap-2 text-sm"><span className="text-green-400">✓</span> Access to "The Vault"</li>
              </ul>
              <Button variant="secondary" className="w-full">Unlock Platinum</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
