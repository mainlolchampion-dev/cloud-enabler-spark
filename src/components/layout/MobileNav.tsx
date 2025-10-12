import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart, Users, PartyPopper, Settings, LogOut, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Αποσυνδεθήκατε επιτυχώς" });
    navigate("/login");
    setOpen(false);
  };

  const navItems = [
    { icon: Home, label: "Αρχική", path: "/dashboard" },
    { icon: Heart, label: "Γάμοι", path: "/wedding/all" },
    { icon: Users, label: "Βαπτίσεις", path: "/baptism/all" },
    { icon: PartyPopper, label: "Πάρτι", path: "/party/all" },
    { icon: Settings, label: "Ρυθμίσεις", path: "/profile" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <nav className="flex flex-col gap-4 mt-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Icon className="w-5 h-5 text-primary" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          <div className="border-t pt-4 mt-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-4"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 text-destructive" />
              <span className="font-medium text-destructive">Αποσύνδεση</span>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
