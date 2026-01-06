import { Layout } from "@/components/Layout";
import { MapPin, Clock, DollarSign } from "lucide-react";

export default function DeliveryZonesPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold font-serif">Delivery Zones</h1>
            <p className="text-xl text-muted-foreground">
              We deliver premium cannabis throughout the San Fernando Valley
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">Wide Coverage</h3>
              <p className="text-sm text-muted-foreground">
                Serving all major areas in the San Fernando Valley
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">
                60-90 minute delivery window for most orders in the primary coverage zone
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">Free Delivery</h3>
              <p className="text-sm text-muted-foreground">
                On orders over $75 within our delivery zones
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Coverage Areas</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-primary">Primary Zones</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Woodland Hills</li>
                  <li>• Calabasas</li>
                  <li>• Hidden Hills</li>
                  <li>• West Hills</li>
                  <li>• Canoga Park</li>
                  <li>• Winnetka</li>
                  <li>• Tarzana</li>
                  <li>• Topanga</li>
                  <li>• Chatsworth</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-primary">Extended Zones</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Agoura Hills</li>
                  <li>• Northridge</li>
                  <li>• Encino</li>
                  <li>• Porter Ranch</li>
                  <li>• Westlake Village</li>
                  <li>• Sherman Oaks</li>
                  <li>• Thousand Oaks</li>
                  <li>• Simi Valley</li>
                  <li>• Van Nuys</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-secondary/20 rounded-lg p-6">
            <p className="text-center text-sm text-muted-foreground">
              Not sure if we deliver to your area? Check your ZIP code at checkout or contact us at (818) 555-0123
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
