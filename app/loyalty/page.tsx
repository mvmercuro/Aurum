import { Layout } from "@/components/Layout";
import { Gift, Star, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoyaltyPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold font-serif">Loyalty Rewards</h1>
            <p className="text-xl text-muted-foreground">
              Earn points with every purchase and unlock exclusive rewards
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary to-purple-600 text-white rounded-lg p-8 text-center">
            <Gift className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Join Our Rewards Program</h2>
            <p className="text-white/80 mb-6">
              Start earning points today and get rewarded for your loyalty
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Sign Up Now
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Earn Points</h3>
              <p className="text-sm text-muted-foreground">
                Get 1 point for every dollar spent on qualifying purchases
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Unlock Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Redeem points for discounts, free products, and exclusive deals
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Level Up</h3>
              <p className="text-sm text-muted-foreground">
                Reach higher tiers for bonus points and VIP perks
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Reward Tiers</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold shrink-0">
                  S
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Silver (0-999 points)</h3>
                  <p className="text-sm text-muted-foreground">
                    1x points on all purchases • Birthday reward • Early access to sales
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold shrink-0">
                  G
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Gold (1000-2499 points)</h3>
                  <p className="text-sm text-muted-foreground">
                    1.25x points • Priority delivery • Exclusive product access
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold shrink-0">
                  P
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Platinum (2500+ points)</h3>
                  <p className="text-sm text-muted-foreground">
                    1.5x points • VIP concierge service • Special gifts & surprises
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-secondary/20 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">How to Redeem</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• 100 points = $5 off your order</li>
              <li>• 250 points = $15 off your order</li>
              <li>• 500 points = $35 off your order</li>
              <li>• 1000 points = Free premium product of your choice</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
