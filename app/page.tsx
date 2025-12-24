import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <div className="container mx-auto px-4 py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary">Why Choose Aurum?</h2>
          <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
            We operate at the intersection of luxury and convenience, providing an unmatched cannabis experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 font-serif">Curated Selection</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every product on our menu is hand-selected for quality, potency, and purity. We only stock the best.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 font-serif">Fast & Discreet</h3>
            <p className="text-muted-foreground leading-relaxed">
              Professional drivers deliver to your door in 60-90 minutes. Unmarked cars and privacy guaranteed.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 font-serif">Community First</h3>
            <p className="text-muted-foreground leading-relaxed">
              Born and raised in the Valley. We're dedicated to serving our neighbors with respect and care.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
