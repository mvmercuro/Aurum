"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ordersApi, CreateOrderRequest } from "@/lib/api";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const checkoutSchema = z.object({
    customerName: z.string().min(2, "Name is required"),
    customerPhone: z.string().min(10, "Valid phone number is required"),
    customerEmail: z.string().email("Valid email is required").optional().or(z.literal("")),
    address1: z.string().min(5, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    zip: z.string().min(5, "ZIP code is required"),
    notes: z.string().optional(),
    paymentMethod: z.enum(["cash", "debit"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [zipError, setZipError] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            customerName: "",
            customerPhone: "",
            customerEmail: "",
            address1: "",
            address2: "",
            city: "",
            zip: "",
            notes: "",
            paymentMethod: "cash",
        },
    });

    const checkZipCode = async (zip: string) => {
        if (zip.length < 5) return;
        setZipError(null);
        try {
            const result = await ordersApi.checkZip(zip);
            if (!result.available) {
                setZipError(result.error || "Delivery not available to this ZIP code.");
            }
        } catch (e: any) {
            // Assume unavailable on error for safety
            setZipError(e.response?.data?.error || "Unable to verify delivery area.");
        }
    };

    const onSubmit = async (data: CheckoutFormValues) => {
        setIsSubmitting(true);
        setApiError(null);

        // 1. Double check ZIP
        try {
            const zipCheck = await ordersApi.checkZip(data.zip);
            if (!zipCheck.available) {
                setZipError(zipCheck.error || "Delivery unavailable.");
                setIsSubmitting(false);
                return;
            }

            // 2. Prepare Order
            const orderRequest: CreateOrderRequest = {
                ...data,
                items: items.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };

            // 3. Submit
            const response = await ordersApi.create(orderRequest);

            if (response.success) {
                clearCart();
                router.push(`/order-confirmation/${response.orderNumber}`);
            } else {
                setApiError(response.message || "Failed to create order");
            }
        } catch (e: any) {
            console.error(e);
            setApiError(e.response?.data?.error || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
                <Button asChild>
                    <Link href="/shop">Go Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="mb-8">
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                    <ArrowLeft className="h-4 w-4" /> Back to Menu
                </Link>
                <h1 className="text-3xl font-serif font-bold">Checkout</h1>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="md:col-span-2 space-y-8">
                    {apiError && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{apiError}</AlertDescription>
                        </Alert>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Contact Info */}
                            <div className="space-y-4 rounded-lg border border-border p-6 bg-card">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    1. Contact Information
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="customerName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Jane Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="customerPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="(555) 555-5555" type="tel" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="customerEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="jane@example.com" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Delivery Address */}
                            <div className="space-y-4 rounded-lg border border-border p-6 bg-card">
                                <h3 className="font-semibold text-lg">2. Delivery Address</h3>
                                <FormField
                                    control={form.control}
                                    name="address1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Street Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 Main St" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Apt / Suite (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Apt 4B" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Los Angeles" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="zip"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>ZIP Code</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="91335"
                                                        {...field}
                                                        onBlur={(e) => {
                                                            field.onBlur();
                                                            checkZipCode(e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                {zipError && <p className="text-sm font-medium text-destructive">{zipError}</p>}
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Delivery Instructions (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Gate code is #1234..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Payment */}
                            <div className="space-y-4 rounded-lg border border-border p-6 bg-card">
                                <h3 className="font-semibold text-lg">3. Payment</h3>
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="cash" id="cash" />
                                                        </FormControl>
                                                        <FormLabel htmlFor="cash" className="font-normal cursor-pointer">
                                                            Cash on Delivery
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="debit" id="debit" />
                                                        </FormControl>
                                                        <FormLabel htmlFor="debit" className="font-normal cursor-pointer">
                                                            Debit Card via Terminal ($3 fee)
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="lg:hidden">
                                {/* Mobile Summary would go here typically, holding space for now */}
                            </div>

                        </form>
                    </Form>
                </div>

                {/* Summary Column */}
                <div className="space-y-6">
                    <div className="sticky top-24 bg-card border border-border rounded-lg p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                        <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground mr-2">
                                        {item.quantity}x {item.name}
                                    </span>
                                    <span className="font-medium">
                                        ${(item.priceCents * item.quantity / 100).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-border pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${(cartTotal / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Delivery</span>
                                <span>{cartTotal >= 5000 ? 'Free' : 'Calculated next'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Taxes</span>
                                <span>Calculated next</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t border-border/50 pt-2 mt-2">
                                <span>Total (Est.)</span>
                                <span>${(cartTotal / 100).toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-6"
                            size="lg"
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={isSubmitting || !!zipError}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Place Order"
                            )}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-4">
                            By placing this order you agree to our Terms of Service and verify you are of legal age.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
