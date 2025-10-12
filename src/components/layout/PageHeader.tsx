import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  showBackButton?: boolean;
}

export default function PageHeader({ showBackButton = true }: PageHeaderProps) {
  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Heart className="h-7 w-7 text-primary animate-pulse" fill="currentColor" />
          <span className="font-serif text-2xl font-semibold text-foreground tracking-tight">
            WediLink
          </span>
        </Link>
        {showBackButton && (
          <Link to="/">
            <Button variant="ghost" className="gap-2 hover:gap-3 transition-all">
              <ArrowLeft className="h-4 w-4" />
              Επιστροφή
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
