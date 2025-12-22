import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center space-y-6">
          <AlertCircle className="h-20 w-20 mx-auto text-muted-foreground" />
          <h1 className="text-6xl font-bold font-serif">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            Sorry, we could not find the page you are looking for.
          </p>
          <Link href="/">
            <Button size="lg" className="mt-4">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
