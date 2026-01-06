"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Search, Users } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Customer {
    id: number;
    name: string;
    phone: string;
    email?: string | null;
    address1?: string | null;
    address2?: string | null;
    city?: string | null;
    state: string;
    zip?: string | null;
    notes?: string | null;
    totalOrders: number;
    lifetimeValueCents: number;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingCustomer, setIsAddingCustomer] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Customer form state
    const [newCustomer, setNewCustomer] = useState({
        name: "",
        phone: "",
        email: "",
        address1: "",
        address2: "",
        city: "",
        state: "CA",
        zip: "",
        notes: "",
    });

    const fetchCustomers = async () => {
        try {
            const url = searchQuery
                ? `/api/admin/customers?search=${encodeURIComponent(searchQuery)}`
                : "/api/admin/customers";

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setCustomers(data);
            } else {
                toast.error("Failed to load customers");
            }
        } catch (error) {
            toast.error("Failed to load customers");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleSearch = () => {
        setIsLoading(true);
        fetchCustomers();
    };

    const handleAddCustomer = async () => {
        if (!newCustomer.name || !newCustomer.phone) {
            toast.error("Name and phone are required");
            return;
        }

        setIsAddingCustomer(true);
        try {
            const res = await fetch("/api/admin/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCustomer),
            });

            if (res.ok) {
                toast.success("Customer added successfully");
                setNewCustomer({
                    name: "",
                    phone: "",
                    email: "",
                    address1: "",
                    address2: "",
                    city: "",
                    state: "CA",
                    zip: "",
                    notes: "",
                });
                setIsDialogOpen(false);
                fetchCustomers();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to add customer");
            }
        } catch (error) {
            toast.error("Failed to add customer");
        } finally {
            setIsAddingCustomer(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Customers</h1>
                <p className="text-muted-foreground mt-2">
                    Manage customer information and order history
                </p>
            </div>

            {/* Search and Add */}
            <div className="flex items-center gap-4">
                <div className="flex-1 flex gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or phone..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                    </div>
                    <Button onClick={handleSearch} variant="secondary">
                        Search
                    </Button>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Customer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Customer</DialogTitle>
                            <DialogDescription>
                                Create a customer profile for faster order processing
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={newCustomer.name}
                                        onChange={(e) =>
                                            setNewCustomer({ ...newCustomer, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone *</Label>
                                    <Input
                                        id="phone"
                                        placeholder="(555) 555-5555"
                                        value={newCustomer.phone}
                                        onChange={(e) =>
                                            setNewCustomer({ ...newCustomer, phone: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={newCustomer.email}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, email: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address1">Address Line 1</Label>
                                <Input
                                    id="address1"
                                    placeholder="123 Main St"
                                    value={newCustomer.address1}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, address1: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address2">Address Line 2</Label>
                                <Input
                                    id="address2"
                                    placeholder="Apt 4B"
                                    value={newCustomer.address2}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, address2: e.target.value })
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        placeholder="Los Angeles"
                                        value={newCustomer.city}
                                        onChange={(e) =>
                                            setNewCustomer({ ...newCustomer, city: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        placeholder="CA"
                                        value={newCustomer.state}
                                        onChange={(e) =>
                                            setNewCustomer({ ...newCustomer, state: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip">ZIP Code</Label>
                                    <Input
                                        id="zip"
                                        placeholder="91335"
                                        value={newCustomer.zip}
                                        onChange={(e) =>
                                            setNewCustomer({ ...newCustomer, zip: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Input
                                    id="notes"
                                    placeholder="Delivery instructions, preferences, etc."
                                    value={newCustomer.notes}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, notes: e.target.value })
                                    }
                                />
                            </div>
                            <Button
                                onClick={handleAddCustomer}
                                disabled={isAddingCustomer}
                                className="w-full"
                            >
                                {isAddingCustomer ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Add Customer"
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Customers Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        All Customers
                    </CardTitle>
                    <CardDescription>
                        {customers.length} customer{customers.length !== 1 ? "s" : ""} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {customers.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No customers found
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Orders</TableHead>
                                        <TableHead>Lifetime Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.map((customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell className="font-medium">
                                                {customer.name}
                                            </TableCell>
                                            <TableCell>{customer.phone}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {customer.address1 || customer.city || customer.zip
                                                    ? `${customer.address1 || ""}${
                                                          customer.city ? ", " + customer.city : ""
                                                      }${customer.zip ? " " + customer.zip : ""}`
                                                    : "No address"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {customer.totalOrders}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                ${(customer.lifetimeValueCents / 100).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
