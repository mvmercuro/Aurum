import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, PartyPopper } from "lucide-react";
import { Input } from "@/components/ui/input";

export function FirstTimeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the modal before
    const hasSeenModal = localStorage.getItem("hasSeenFirstTimeModal");

    // Show modal after a short delay if they haven't seen it
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenFirstTimeModal", "true");
  };

  const handleClaim = () => {
    // Logic to apply discount code or redirect to signup
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-primary/20 bg-card/95 backdrop-blur-xl">
        <DialogHeader className="text-center items-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 animate-bounce">
            <Gift className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-3xl font-serif font-bold">First Time?</DialogTitle>
          <DialogDescription className="text-lg text-foreground/90">
            Unlock your <span className="font-bold text-primary">Welcome Goody Bag</span> with your first order!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-secondary/30 p-4 rounded-lg border border-border/50 space-y-2">
            <div className="flex items-center gap-3">
              <PartyPopper className="h-5 w-5 text-pink-400" />
              <span className="font-medium">Free Premium Pre-roll</span>
            </div>
            <div className="flex items-center gap-3">
              <PartyPopper className="h-5 w-5 text-purple-400" />
              <span className="font-medium">20% Off Entire Cart</span>
            </div>
            <div className="flex items-center gap-3">
              <PartyPopper className="h-5 w-5 text-yellow-400" />
              <span className="font-medium">Free Delivery</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-center text-muted-foreground">Enter your email to unlock rewards</p>
            <Input placeholder="name@example.com" className="text-center" />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button size="lg" className="w-full text-lg font-bold" onClick={handleClaim}>
            Claim My Goody Bag
          </Button>
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={handleClose}>
            No thanks, I&apos;ll pay full price
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
