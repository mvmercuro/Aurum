import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, MapPin, Award, Users } from "lucide-react";

export function AdminNav() {
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="ghost" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Products
            </Button>
          </Link>
          <Link href="/admin/customers">
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Customers
            </Button>
          </Link>
          <Link href="/admin/rewards">
            <Button variant="ghost" size="sm">
              <Award className="h-4 w-4 mr-2" />
              Rewards
            </Button>
          </Link>
          <Link href="/admin/delivery-zones">
            <Button variant="ghost" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              Delivery Zones
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
