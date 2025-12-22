import { Layout } from '@/components/Layout';

export default function HomePage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Welcome to Aurum
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium cannabis delivery in Southern California
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <a
              href="/shop"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
            >
              Shop Now
            </a>
            <a
              href="/delivery-zones"
              className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition"
            >
              Delivery Zones
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
