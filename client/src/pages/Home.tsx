import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, Truck, ShieldCheck, Clock, MapPin } from "lucide-react";
import { Link } from "wouter";
import { products } from "@/lib/products";

// Select top 4 products for featured section
const featuredProducts = products.slice(0, 4);

const categories = [
  { name: "Flower", image: "/images/flower-category.jpg", desc: "Premium indoor grown buds" },
  { name: "Vapes", image: "/images/vape-category.jpg", desc: "Clean, potent cartridges" },
  { name: "Edibles", image: "/images/edible-category.jpg", desc: "Gourmet infused treats" },
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.jpg" 
            alt="SFV Night Skyline" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="container relative z-10 pt-20">
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-medium text-primary tracking-wide uppercase">Now Delivering to Woodland Hills</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-foreground">
              Elevated Cannabis <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                Delivered to You
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Experience the San Fernando Valley's premier cannabis concierge service. 
              Curated top-shelf products delivered discreetly to your door in 60 minutes or less.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="text-lg h-14 px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:scale-105">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 border-primary/20 hover:bg-primary/5 backdrop-blur-sm">
                View Delivery Zones
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-8 text-sm text-muted-foreground/80">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>60-90 Min Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Lab Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <span>Free Over $50</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-background relative">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">Curated Collections</h2>
              <p className="text-muted-foreground">Explore our premium selection by category</p>
            </div>
            <Link href="/shop">
              <Button variant="ghost" className="group text-primary hover:text-primary/80">
                View Full Menu 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.name} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-border/50">
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">{cat.name}</h3>
                  <p className="text-white/70 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {cat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-secondary/5">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Staff Picks</h2>
            <p className="text-muted-foreground">
              Hand-selected favorites from our expert budtenders. These top-shelf strains and products represent the best of what the Valley has to offer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Service Area Map Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                Serving the Entire <br />
                <span className="text-primary">San Fernando Valley</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From the hills of Woodland Hills to the streets of Northridge, we bring premium cannabis directly to your doorstep. Our discreet, professional drivers ensure a safe and timely delivery every time.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <MapPin className="h-6 w-6 text-primary mb-3" />
                  <h4 className="font-bold mb-1">Northridge</h4>
                  <p className="text-xs text-muted-foreground">91324, 91325, 91326</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <MapPin className="h-6 w-6 text-primary mb-3" />
                  <h4 className="font-bold mb-1">Woodland Hills</h4>
                  <p className="text-xs text-muted-foreground">91364, 91365, 91367</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <MapPin className="h-6 w-6 text-primary mb-3" />
                  <h4 className="font-bold mb-1">Van Nuys</h4>
                  <p className="text-xs text-muted-foreground">91401, 91405, 91406</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <MapPin className="h-6 w-6 text-primary mb-3" />
                  <h4 className="font-bold mb-1">Sherman Oaks</h4>
                  <p className="text-xs text-muted-foreground">91403, 91423</p>
                </div>
              </div>

              <Button size="lg" className="w-full sm:w-auto">
                Check Your Address
              </Button>
            </div>
            
            <div className="relative h-[500px] rounded-2xl overflow-hidden border border-border shadow-2xl shadow-black/20">
              {/* Placeholder for Map - In a real app, this would be an interactive map */}
              <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
                <img 
                  src="/images/hero-bg.jpg" 
                  alt="Map Placeholder" 
                  className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="secondary" className="shadow-xl">
                    View Interactive Map
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container relative z-10 text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Ready to Elevate Your Experience?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join our loyalty program today and get 20% off your first order. Premium cannabis, delivered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg h-14 px-10 shadow-xl shadow-primary/20">
              Start Shopping
            </Button>
            <Button size="lg" variant="outline" className="text-lg h-14 px-10 bg-background/50 backdrop-blur-sm">
              Sign Up
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
