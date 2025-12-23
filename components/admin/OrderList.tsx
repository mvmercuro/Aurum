"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Order } from "@/drizzle/schema";
import { CheckCircle, Clock, Truck, XCircle, Printer } from "lucide-react";
import { format } from "date-fns";

interface OrderListProps {
    orders: Order[];
}

export function OrderList({ orders }: OrderListProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "new":
                return <Badge variant="default" className="bg-blue-500">New</Badge>;
            case "preparing":
                return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">Preparing</Badge>;
            case "out_for_delivery":
                return <Badge variant="secondary" className="bg-purple-500/10 text-purple-500">On Route</Badge>;
            case "delivered":
                return <Badge variant="outline" className="text-green-600 border-green-600">Delivered</Badge>;
            case "canceled":
                return <Badge variant="destructive">Canceled</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "new":
                return <Clock className="h-4 w-4 text-blue-500" />;
            case "out_for_delivery":
                return <Truck className="h-4 w-4 text-purple-500" />;
            case "delivered":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "canceled":
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">No orders found.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-mono font-medium">
                                {order.orderNumber}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {format(new Date(order.createdAt), "MMM d, h:mm a")}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{order.customerName}</span>
                                    <span className="text-xs text-muted-foreground">{order.customerPhone}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(order.status)}
                                    {getStatusBadge(order.status)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="capitalize">
                                    {order.paymentMethod}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                ${(order.totalCents / 100).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" title="Print Receipt">
                                    <Printer className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
