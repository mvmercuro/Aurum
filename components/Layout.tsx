"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AgeGate } from "./AgeGate";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop Menu" },
    { href: "/loyalty", label: "Rewards" },
    { href: "/delivery-zones", label: "Delivery Zones" },
    { href: "/about", label: "About Us" },
    { href: "/track", label: "Track Order" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <AgeGate />

      {/* Top Bar */}
      <div className="bg-primary/5 text-xs py-2 px-4 text-center border-b border-primary/10 backdrop-blur-sm">
        <span className="font-medium text-primary-foreground/90">
          FREE DELIVERY on orders over $50 • 60-90 Minute ETA • Cash & Debit Accepted
        </span>
      </div>

      {/* Navigation */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${isScrolled
          ? "bg-background/80 backdrop-blur-md border-border shadow-lg shadow-black/5"
          : "bg-transparent border-transparent"
          }`}
      >
        <div className="container flex h-20 items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-card border-r border-border">
              <div className="flex flex-col gap-8 mt-8">
                <div className="font-serif text-2xl font-bold text-primary flex items-center gap-3">
                  Aurum
                </div>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <div className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors">
                        {link.label}
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="hidden md:block">
                <h1 className="font-serif text-xl font-bold tracking-tight leading-none">Aurum</h1>
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Cannabis Concierge</p>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer relative group ${location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}>
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${location === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`} />
                </div>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:flex gap-2 text-muted-foreground hover:text-primary">
              <MapPin className="h-4 w-4" />
              <span className="text-xs">Delivering to SFV</span>
            </Button>
            <Button size="icon" variant="outline" className="relative border-primary/20 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group">
              <ShoppingBag className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                0
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-card border-t border-border mt-20">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold flex items-center gap-2">
                <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
                Aurum
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Elevating the cannabis experience in the San Fernando Valley. Premium products, professional service, and discreet delivery.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-primary">Shop</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition-colors">Flower</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Vapes</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Edibles</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Concentrates</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-primary">Support</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition-colors">Delivery Zones</li>
                <li className="hover:text-primary cursor-pointer transition-colors">FAQ</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-primary">Contact</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  (818) 555-0123
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  San Fernando Valley, CA
                </li>
                <li className="pt-4 text-xs opacity-70">
                  Mon-Sun: 9am - 10pm
                  <br />
                  License # C9-0000000-LIC
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground/60">
            <p className="mb-2">
              GOVERNMENT WARNING: THIS PACKAGE CONTAINS CANNABIS. KEEP OUT OF REACH OF CHILDREN AND ANIMALS. CANNABIS MAY ONLY BE POSSESSED OR CONSUMED BY PERSONS 21 YEARS OF AGE OR OLDER UNLESS THE PERSON IS A QUALIFIED PATIENT. CANNABIS USE WHILE PREGNANT OR BREASTFEEDING MAY BE HARMFUL. CONSUMPTION OF CANNABIS IMPAIRS YOUR ABILITY TO DRIVE AND OPERATE MACHINERY. PLEASE USE EXTREME CAUTION.
            </p>
            <p>© 2025 SFV Premium Cannabis Delivery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
