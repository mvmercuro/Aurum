"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface InvoiceProps {
  order: {
    id: number;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    address1: string;
    address2?: string | null;
    city: string;
    state: string;
    zip: string;
    subtotalCents: number;
    deliveryFeeCents: number;
    totalCents: number;
    paymentMethod: string;
    createdAt: string;
    items: Array<{
      productName: string;
      quantity: number;
      priceCentsAtPurchase: number;
    }>;
  };
}

export function CustomerInvoice({ order }: InvoiceProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="no-print mb-4">
        <Button onClick={handlePrint} className="w-full">
          <Printer className="h-4 w-4 mr-2" />
          Print Customer Receipt
        </Button>
      </div>

      <div className="bg-white text-black p-8 print:p-0">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-black pb-4">
          <h1 className="text-3xl font-bold mb-2">Aurum</h1>
          <p className="text-sm">Premium Cannabis Delivery</p>
          <p className="text-sm">(818) 555-0123</p>
        </div>

        {/* Order Info */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-semibold">Order #:</p>
              <p>{order.orderNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Date:</p>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="font-semibold">Deliver To:</p>
            <p>{order.customerName}</p>
            <p>{order.customerPhone}</p>
            <p>{order.address1}</p>
            {order.address2 && <p>{order.address2}</p>}
            <p>{order.city}, {order.state} {order.zip}</p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2">Item</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="py-2">{item.productName}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">${(item.priceCentsAtPurchase / 100).toFixed(2)}</td>
                  <td className="text-right">
                    ${((item.priceCentsAtPurchase * item.quantity) / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t-2 border-black pt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>${(order.subtotalCents / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery Fee:</span>
            <span>${(order.deliveryFeeCents / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t-2 border-black pt-2">
            <span>Total:</span>
            <span>${(order.totalCents / 100).toFixed(2)}</span>
          </div>
          <div className="mt-4 text-sm">
            <p className="font-semibold">Payment Method: {order.paymentMethod.toUpperCase()}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-center">
          <p className="mb-2">
            GOVERNMENT WARNING: CANNABIS MAY ONLY BE POSSESSED OR CONSUMED BY PERSONS 21 YEARS OF AGE OR OLDER
            UNLESS THE PERSON IS A QUALIFIED PATIENT. CANNABIS USE WHILE PREGNANT OR BREASTFEEDING MAY BE HARMFUL.
            CONSUMPTION OF CANNABIS IMPAIRS YOUR ABILITY TO DRIVE AND OPERATE MACHINERY. PLEASE USE EXTREME CAUTION.
          </p>
          <p className="mt-4">Thank you for your business!</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
    </div>
  );
}
