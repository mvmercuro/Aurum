import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Why Choose SFV Premium?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We are dedicated to providing the highest quality cannabis products with unmatched service.
          </p>
        </div>
      </div>
    </Layout>
  );
}
