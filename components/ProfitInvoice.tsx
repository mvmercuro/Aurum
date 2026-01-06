"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface ProfitInvoiceProps {
  order: {
    id: number;
    orderNumber: string;
    customerName: string;
    subtotalCents: number;
    deliveryFeeCents: number;
    totalCents: number;
    createdAt: string;
    items: Array<{
      productName: string;
      quantity: number;
      priceCentsAtPurchase: number;
      costCentsAtPurchase?: number | null;
    }>;
  };
}

export function ProfitInvoice({ order }: ProfitInvoiceProps) {
  const handlePrint = () => {
    window.print();
  };

  // Calculate totals
  const totalCost = order.items.reduce((sum, item) => {
    const cost = item.costCentsAtPurchase || 0;
    return sum + (cost * item.quantity);
  }, 0);

  const totalRevenue = order.subtotalCents;
  const grossProfit = totalRevenue - totalCost;
  const netProfit = grossProfit; // After delivery (delivery fee - driver costs if tracked)
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="no-print mb-4">
        <Button onClick={handlePrint} variant="secondary" className="w-full">
          <Printer className="h-4 w-4 mr-2" />
          Print Internal Report
        </Button>
      </div>

      <div className="bg-white text-black p-8 print:p-0">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-black pb-4">
          <h1 className="text-3xl font-bold mb-2">INTERNAL PROFIT REPORT</h1>
          <p className="text-sm text-red-600 font-bold">CONFIDENTIAL - DO NOT DISTRIBUTE</p>
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
            <div>
              <p className="font-semibold">Customer:</p>
              <p>{order.customerName}</p>
            </div>
            <div>
              <p className="font-semibold">Profit Margin:</p>
              <p className={profitMargin >= 30 ? "text-green-600 font-bold" : "text-orange-600 font-bold"}>
                {profitMargin.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Items with Cost Analysis */}
        <div className="mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2">Item</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Cost/Unit</th>
                <th className="text-right py-2">Price/Unit</th>
                <th className="text-right py-2">Total Cost</th>
                <th className="text-right py-2">Revenue</th>
                <th className="text-right py-2">Profit</th>
                <th className="text-right py-2">Margin%</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => {
                const itemCost = (item.costCentsAtPurchase || 0) * item.quantity;
                const itemRevenue = item.priceCentsAtPurchase * item.quantity;
                const itemProfit = itemRevenue - itemCost;
                const itemMargin = itemRevenue > 0 ? (itemProfit / itemRevenue) * 100 : 0;

                return (
                  <tr key={idx} className="border-b border-gray-300">
                    <td className="py-2">{item.productName}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">${((item.costCentsAtPurchase || 0) / 100).toFixed(2)}</td>
                    <td className="text-right">${(item.priceCentsAtPurchase / 100).toFixed(2)}</td>
                    <td className="text-right">${(itemCost / 100).toFixed(2)}</td>
                    <td className="text-right">${(itemRevenue / 100).toFixed(2)}</td>
                    <td className="text-right font-semibold">${(itemProfit / 100).toFixed(2)}</td>
                    <td className="text-right">{itemMargin.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Profit Summary */}
        <div className="border-t-2 border-black pt-4">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-3 text-lg">Costs</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Product Costs:</span>
                  <span className="font-semibold">${(totalCost / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Total Costs:</span>
                  <span className="font-bold">${(totalCost / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-lg">Revenue</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${(order.subtotalCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className="font-semibold">${(order.deliveryFeeCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Total Revenue:</span>
                  <span className="font-bold">${(order.totalCents / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded">
            <div className="grid grid-cols-2 gap-4 text-lg">
              <div className="flex justify-between">
                <span className="font-bold">Gross Profit:</span>
                <span className="font-bold text-green-600">${(grossProfit / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Profit Margin:</span>
                <span className="font-bold text-green-600">{profitMargin.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-xs">
          <p className="text-red-600 font-bold mb-2">CONFIDENTIAL FINANCIAL INFORMATION</p>
          <p>This report contains proprietary cost and profit data. Distribution is strictly prohibited.</p>
          <p className="mt-2">Use this report for internal pricing analysis and markup adjustments.</p>
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
