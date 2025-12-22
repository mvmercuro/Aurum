"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/lib/const";

export default function AdminLoginPage() {
  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full bg-card rounded-lg shadow-xl border border-border">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
            <span className="font-serif text-3xl font-bold text-white">S</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-center">
            Admin Login
          </h1>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Access the admin dashboard to manage products, orders, and delivery zones.
          </p>
        </div>
        <Button
          onClick={handleLogin}
          size="lg"
          className="w-full shadow-lg hover:shadow-xl transition-all"
        >
          Sign in with OAuth
        </Button>
      </div>
    </div>
  );
}
