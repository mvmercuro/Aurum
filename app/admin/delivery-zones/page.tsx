"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, MapPin } from "lucide-react";
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

interface Region {
    id: number;
    name: string;
    deliveryFeeCents: number;
    minimumOrderCents: number;
    isActive: boolean;
}

interface ZipCode {
    id: number;
    zip: string;
    regionId: number;
    isActive: boolean;
}

export default function DeliveryZonesPage() {
    const [regions, setRegions] = useState<Region[]>([]);
    const [zipCodes, setZipCodes] = useState<ZipCode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingRegion, setIsAddingRegion] = useState(false);
    const [isAddingZip, setIsAddingZip] = useState(false);

    // Region form state
    const [newRegion, setNewRegion] = useState({
        name: "",
        deliveryFeeCents: "",
        minimumOrderCents: "",
    });

    // Zip code form state
    const [newZip, setNewZip] = useState({
        zip: "",
        regionId: "",
    });

    const fetchData = async () => {
        try {
            const [regionsRes, zipCodesRes] = await Promise.all([
                fetch("/api/admin/delivery-zones/regions"),
                fetch("/api/admin/delivery-zones/zip-codes"),
            ]);

            if (regionsRes.ok) {
                const regionsData = await regionsRes.json();
                setRegions(regionsData);
            }

            if (zipCodesRes.ok) {
                const zipCodesData = await zipCodesRes.json();
                setZipCodes(zipCodesData);
            }
        } catch (error) {
            toast.error("Failed to load delivery zones");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddRegion = async () => {
        if (!newRegion.name || !newRegion.deliveryFeeCents || !newRegion.minimumOrderCents) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsAddingRegion(true);
        try {
            const res = await fetch("/api/admin/delivery-zones/regions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newRegion.name,
                    deliveryFeeCents: parseInt(newRegion.deliveryFeeCents),
                    minimumOrderCents: parseInt(newRegion.minimumOrderCents),
                }),
            });

            if (res.ok) {
                toast.success("Region added successfully");
                setNewRegion({ name: "", deliveryFeeCents: "", minimumOrderCents: "" });
                fetchData();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to add region");
            }
        } catch (error) {
            toast.error("Failed to add region");
        } finally {
            setIsAddingRegion(false);
        }
    };

    const handleAddZipCode = async () => {
        if (!newZip.zip || !newZip.regionId) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsAddingZip(true);
        try {
            const res = await fetch("/api/admin/delivery-zones/zip-codes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    zip: newZip.zip,
                    regionId: parseInt(newZip.regionId),
                }),
            });

            if (res.ok) {
                toast.success("ZIP code added successfully");
                setNewZip({ zip: "", regionId: "" });
                fetchData();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to add ZIP code");
            }
        } catch (error) {
            toast.error("Failed to add ZIP code");
        } finally {
            setIsAddingZip(false);
        }
    };

    const handleDeleteRegion = async (id: number) => {
        if (!confirm("Are you sure you want to delete this region?")) return;

        try {
            const res = await fetch(`/api/admin/delivery-zones/regions/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Region deleted successfully");
                fetchData();
            } else {
                toast.error("Failed to delete region");
            }
        } catch (error) {
            toast.error("Failed to delete region");
        }
    };

    const handleDeleteZip = async (id: number) => {
        if (!confirm("Are you sure you want to delete this ZIP code?")) return;

        try {
            const res = await fetch(`/api/admin/delivery-zones/zip-codes/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("ZIP code deleted successfully");
                fetchData();
            } else {
                toast.error("Failed to delete ZIP code");
            }
        } catch (error) {
            toast.error("Failed to delete ZIP code");
        }
    };

    const getRegionName = (regionId: number) => {
        return regions.find((r) => r.id === regionId)?.name || "Unknown";
    };

    const getZipCountForRegion = (regionId: number) => {
        return zipCodes.filter((z) => z.regionId === regionId && z.isActive).length;
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
                <h1 className="text-3xl font-bold">Delivery Zones</h1>
                <p className="text-muted-foreground mt-2">
                    Manage delivery regions and ZIP codes
                </p>
            </div>

            {regions.length === 0 && zipCodes.length === 0 && (
                <Alert>
                    <MapPin className="h-4 w-4" />
                    <AlertDescription>
                        No delivery zones configured yet. Add regions and ZIP codes to enable order creation.
                    </AlertDescription>
                </Alert>
            )}

            {/* Regions Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Regions</CardTitle>
                            <CardDescription>
                                Service areas with delivery fees and minimums
                            </CardDescription>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Region
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Region</DialogTitle>
                                    <DialogDescription>
                                        Create a new delivery service area
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="region-name">Region Name</Label>
                                        <Input
                                            id="region-name"
                                            placeholder="e.g., San Fernando Valley"
                                            value={newRegion.name}
                                            onChange={(e) =>
                                                setNewRegion({ ...newRegion, name: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="delivery-fee">Delivery Fee (cents)</Label>
                                        <Input
                                            id="delivery-fee"
                                            type="number"
                                            placeholder="500 = $5.00"
                                            value={newRegion.deliveryFeeCents}
                                            onChange={(e) =>
                                                setNewRegion({
                                                    ...newRegion,
                                                    deliveryFeeCents: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="minimum-order">Minimum Order (cents)</Label>
                                        <Input
                                            id="minimum-order"
                                            type="number"
                                            placeholder="2000 = $20.00"
                                            value={newRegion.minimumOrderCents}
                                            onChange={(e) =>
                                                setNewRegion({
                                                    ...newRegion,
                                                    minimumOrderCents: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <Button
                                        onClick={handleAddRegion}
                                        disabled={isAddingRegion}
                                        className="w-full"
                                    >
                                        {isAddingRegion ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            "Add Region"
                                        )}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {regions.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No regions configured yet
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Delivery Fee</TableHead>
                                    <TableHead>Minimum Order</TableHead>
                                    <TableHead>ZIP Codes</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {regions.map((region) => (
                                    <TableRow key={region.id}>
                                        <TableCell className="font-medium">{region.name}</TableCell>
                                        <TableCell>
                                            ${(region.deliveryFeeCents / 100).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            ${(region.minimumOrderCents / 100).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {getZipCountForRegion(region.id)} ZIPs
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {region.isActive ? (
                                                <Badge variant="default">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteRegion(region.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* ZIP Codes Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>ZIP Codes</CardTitle>
                            <CardDescription>
                                Delivery areas mapped to regions
                            </CardDescription>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button disabled={regions.length === 0}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add ZIP Code
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add ZIP Code</DialogTitle>
                                    <DialogDescription>
                                        Assign a ZIP code to a delivery region
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="zip-code">ZIP Code</Label>
                                        <Input
                                            id="zip-code"
                                            placeholder="91335"
                                            maxLength={10}
                                            value={newZip.zip}
                                            onChange={(e) =>
                                                setNewZip({ ...newZip, zip: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="region-select">Region</Label>
                                        <select
                                            id="region-select"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={newZip.regionId}
                                            onChange={(e) =>
                                                setNewZip({ ...newZip, regionId: e.target.value })
                                            }
                                        >
                                            <option value="">Select a region</option>
                                            {regions
                                                .filter((r) => r.isActive)
                                                .map((region) => (
                                                    <option key={region.id} value={region.id}>
                                                        {region.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <Button
                                        onClick={handleAddZipCode}
                                        disabled={isAddingZip}
                                        className="w-full"
                                    >
                                        {isAddingZip ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            "Add ZIP Code"
                                        )}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {zipCodes.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No ZIP codes configured yet
                        </p>
                    ) : (
                        <div className="max-h-[400px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ZIP Code</TableHead>
                                        <TableHead>Region</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {zipCodes.map((zip) => (
                                        <TableRow key={zip.id}>
                                            <TableCell className="font-medium">{zip.zip}</TableCell>
                                            <TableCell>{getRegionName(zip.regionId)}</TableCell>
                                            <TableCell>
                                                {zip.isActive ? (
                                                    <Badge variant="default">Active</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Inactive</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteZip(zip.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
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
