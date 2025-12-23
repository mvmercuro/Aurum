import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShieldCheck, Ban } from "lucide-react";

export function AgeGate() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem("age-verified");
    if (!isVerified) {
      setIsOpen(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem("age-verified", "true");
    setIsOpen(false);
  };

  const handleReject = () => {
    window.location.href = "https://google.com";
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { }}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-primary/20 shadow-2xl shadow-primary/10" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('/images/age-gate-bg.jpg')] bg-cover bg-center rounded-lg pointer-events-none" />

        <DialogHeader className="relative z-10 text-center space-y-4 pt-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mb-2">
            <ShieldCheck className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <DialogTitle className="text-3xl font-serif font-bold tracking-tight text-foreground">
            Age Verification
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-lg">
            You must be 21+ years of age to enter this site.
            <br />
            <span className="text-sm mt-2 block opacity-80">
              By clicking &quot;I am 21+&quot;, you verify that you are of legal age to view and purchase cannabis products in California.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 flex flex-col gap-3 py-6">
          <Button
            size="lg"
            className="w-full text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
            onClick={handleVerify}
          >
            I am 21+
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={handleReject}
          >
            <Ban className="w-4 h-4 mr-2" />
            I am under 21
          </Button>
        </div>

        <div className="relative z-10 text-center text-xs text-muted-foreground/50 pb-2">
          License # C9-0000000-LIC • San Fernando Valley, CA
        </div>
      </DialogContent>
    </Dialog>
  );
}
