import { Shield, Truck, Heart, Award } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/20 via-purple-500/10 to-background py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              About SFV Premium
            </h1>
            <p className="text-xl text-muted-foreground">
              The San Fernando Valley's most trusted cannabis delivery service, bringing premium products and professional service directly to your door.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg prose-invert max-w-none mb-16">
            <h2 className="font-display text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded in 2024, SFV Premium Cannabis Delivery was born from a simple belief: cannabis consumers deserve the same level of service and quality as any other premium product. We saw an industry filled with inconsistent service, unreliable delivery times, and products that didn't match their descriptions.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We set out to change that. Every product we carry is personally vetted by our team. Every driver is trained in customer service and compliance. Every delivery is tracked, timed, and treated with the professionalism you'd expect from a luxury concierge service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we serve thousands of customers across the San Fernando Valley, Los Angeles, and Orange County, maintaining the same commitment to quality and service that defined our first delivery.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-card border border-border rounded-2xl p-8">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-display text-2xl font-bold mb-3">Compliance First</h3>
              <p className="text-muted-foreground">
                We operate under a Type 9 Non-Storefront Retailer license from the California Department of Cannabis Control. Every product is tracked through Metrc, every delivery is logged, and every customer is verified.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <Truck className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-display text-2xl font-bold mb-3">Fast & Discreet</h3>
              <p className="text-muted-foreground">
                Most orders arrive within 45-90 minutes. Our drivers use unmarked vehicles, wear professional attire, and respect your privacy. No logos, no noise, no hassle.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <Heart className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-display text-2xl font-bold mb-3">Curated Selection</h3>
              <p className="text-muted-foreground">
                We don't carry everything - we carry the best. Every strain, every brand, every product is tested and approved by our team before it reaches our menu.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <Award className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-display text-2xl font-bold mb-3">Premium Experience</h3>
              <p className="text-muted-foreground">
                From your first click to your final delivery, we treat every interaction as an opportunity to exceed expectations. This isn't just delivery - it's a service.
              </p>
            </div>
          </div>

          {/* License Info */}
          <div className="bg-primary/10 border border-primary/30 rounded-2xl p-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">Licensed Cannabis Retailer</p>
            <p className="font-mono text-lg font-semibold">License # C9-0000000-LIC</p>
            <p className="text-sm text-muted-foreground mt-2">San Fernando Valley, California</p>
          </div>
        </div>
      </div>
    </div>
  );
}
