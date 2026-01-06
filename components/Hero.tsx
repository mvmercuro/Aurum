import Link from "next/link";
import NextImage from "next/image";

import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";

export function Hero() {
    return (
        <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content */}
            <div className="container relative z-10 flex h-full items-center">
                <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="space-y-4">
                        <div className="w-32 h-32 relative mb-6">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <NextImage
                                src="/logo.png"
                                alt="Aurum Logo"
                                fill
                                priority
                                className="object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-1000"
                                sizes="(max-width: 768px) 128px, 128px"
                            />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-serif text-foreground drop-shadow-lg">
                            <span className="block text-primary">Aurum</span>
                            <span className="block">Cannabis Concierge</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground/90 max-w-lg leading-relaxed font-light">
                            Elevating the cannabis experience in Southern California.
                            Curated top-shelf products delivered discreetly to your door.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/shop">
                            <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                                Shop Menu
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/delivery-zones">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-background/80">
                                <MapPin className="mr-2 h-5 w-5" />
                                Delivery Zones
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6 pt-8 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            Accepting Orders
                        </div>
                        <div className="w-px h-4 bg-border" />
                        <div>60-90 Min Delivery</div>
                        <div className="w-px h-4 bg-border" />
                        <div>Cash & Debit</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
