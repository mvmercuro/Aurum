import { Layout } from "@/components/Layout";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
    return (
        <Layout>
            <div className="bg-[#F7F7F7] min-h-screen py-12">
                <CheckoutForm />
            </div>
        </Layout>
    );
}
