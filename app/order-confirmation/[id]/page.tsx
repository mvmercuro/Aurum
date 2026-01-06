import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { orders } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
    const { id } = await params;
    const orderNumber = id;

    const db = await getDb();
    if (!db) {
        throw new Error("Database not available");
    }

    const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, orderNumber))
        .limit(1);

    if (!order) {
        notFound();
    }

    return (
        <Layout>
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-serif font-bold">Order Confirmed!</h1>
                    <p className="text-muted-foreground text-lg">
                        Thank you for your order, {order.customerName.split(' ')[0]}.
                    </p>

                    <div className="bg-card border border-border rounded-lg p-6 text-left space-y-4 shadow-sm">
                        <div className="flex justify-between items-center border-b border-border pb-4">
                            <span className="text-sm font-medium text-muted-foreground">Order Number</span>
                            <span className="font-mono font-bold text-lg">{order.orderNumber}</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Package className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Estimated Delivery</p>
                                    <p className="text-sm text-muted-foreground">60 - 90 Minutes</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Delivering To</p>
                                    <p className="text-sm text-muted-foreground">
                                        {order.address1} {order.address2}<br />
                                        {order.city}, {order.zip}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary/20 p-4 rounded-md mt-4">
                            <div className="flex justify-between font-bold">
                                <span>Total Due</span>
                                <span>${(order.totalCents / 100).toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Please have your ID and payment ready upon arrival.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button className="w-full" asChild size="lg">
                            <Link href="/track">
                                Track Order <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
