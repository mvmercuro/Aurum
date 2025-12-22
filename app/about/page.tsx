import { Layout } from "@/components/Layout";
import { Shield, Truck, Star, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold font-serif">About SFV Premium</h1>
            <p className="text-xl text-muted-foreground">
              Elevating the cannabis experience in the San Fernando Valley since 2020
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              SFV Premium is a licensed cannabis delivery service dedicated to providing the highest quality products and exceptional customer service throughout the San Fernando Valley. We believe in transparency, quality, and building lasting relationships with our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <Shield className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Licensed & Compliant</h3>
              <p className="text-muted-foreground">
                Fully licensed by the state of California and compliant with all regulations. License # C9-0000000-LIC
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <Star className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Premium Selection</h3>
              <p className="text-muted-foreground">
                Curated selection of top-shelf flower, concentrates, edibles, and vapes from trusted brands
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <Truck className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Professional, discreet delivery in 60-90 minutes. Track your order in real-time
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <Award className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Expert Service</h3>
              <p className="text-muted-foreground">
                Knowledgeable staff ready to help you find the perfect product for your needs
              </p>
            </div>
          </div>

          <div className="bg-secondary/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To provide safe, legal access to premium cannabis products while maintaining the highest standards of quality, service, and professionalism. We are committed to educating our customers and promoting responsible consumption.
            </p>
          </div>

          <div className="text-center pt-8">
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
              GOVERNMENT WARNING: THIS PACKAGE CONTAINS CANNABIS. CANNABIS MAY ONLY BE POSSESSED OR CONSUMED BY PERSONS 21 YEARS OF AGE OR OLDER UNLESS THE PERSON IS A QUALIFIED PATIENT. CANNABIS USE WHILE PREGNANT OR BREASTFEEDING MAY BE HARMFUL.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
