import { MapPin, DollarSign, Clock } from "lucide-react";

export default function DeliveryZones() {
  const zones = [
    {
      name: "San Fernando Valley (SFV)",
      deliveryFee: "$5.00",
      minimum: "$30.00",
      cities: ["Northridge", "Van Nuys", "Woodland Hills", "Sherman Oaks", "Encino", "Tarzana", "Reseda", "Canoga Park"],
      color: "bg-purple-500/20 border-purple-500/50",
    },
    {
      name: "Los Angeles (LA)",
      deliveryFee: "$10.00",
      minimum: "$50.00",
      cities: ["Hollywood", "West Hollywood", "Beverly Hills", "Santa Monica", "Culver City", "Downtown LA"],
      color: "bg-blue-500/20 border-blue-500/50",
    },
    {
      name: "Orange County (OC)",
      deliveryFee: "$15.00",
      minimum: "$75.00",
      cities: ["Anaheim", "Irvine", "Santa Ana", "Fullerton", "Orange", "Costa Mesa"],
      color: "bg-orange-500/20 border-orange-500/50",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/20 via-purple-500/10 to-background py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Delivery Zones
            </h1>
            <p className="text-xl text-muted-foreground">
              We deliver premium cannabis products across the San Fernando Valley, Los Angeles, and Orange County. 
              Fast, discreet, and professional service to your door.
            </p>
          </div>
        </div>
      </div>

      {/* Zones Grid */}
      <div className="container py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {zones.map((zone) => (
            <div
              key={zone.name}
              className={`rounded-2xl border-2 ${zone.color} p-8 backdrop-blur-sm`}
            >
              <h3 className="font-display text-2xl font-bold mb-6">{zone.name}</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Fee</p>
                    <p className="font-semibold">{zone.deliveryFee}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Minimum Order</p>
                    <p className="font-semibold">{zone.minimum}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Coverage Areas
                </p>
                <div className="flex flex-wrap gap-2">
                  {zone.cities.map((city) => (
                    <span
                      key={city}
                      className="text-xs px-2 py-1 rounded-full bg-background/50 border border-border"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-card border border-border rounded-2xl p-8 max-w-3xl mx-auto">
          <h3 className="font-display text-2xl font-bold mb-4">Delivery Information</h3>
          <div className="space-y-4 text-muted-foreground">
            <p>
              <strong className="text-foreground">Hours:</strong> We deliver daily from 9:00 AM to 9:00 PM.
            </p>
            <p>
              <strong className="text-foreground">Delivery Time:</strong> Most deliveries arrive within 45-90 minutes of order confirmation.
            </p>
            <p>
              <strong className="text-foreground">Payment:</strong> We accept cash and debit cards at the door. All customers must present a valid California ID showing they are 21+.
            </p>
            <p>
              <strong className="text-foreground">ZIP Code Check:</strong> Enter your ZIP code during checkout to confirm we deliver to your area and see your exact delivery fee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
