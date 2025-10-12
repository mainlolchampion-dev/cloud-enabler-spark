import { Navigate } from "react-router-dom";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdminStatus();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!loading && !isAdmin && user && !hasShownToast.current) {
      toast.error("Δεν έχετε δικαιώματα πρόσβασης στο Admin Dashboard");
      hasShownToast.current = true;
    }
  }, [loading, isAdmin, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Έλεγχος δικαιωμάτων...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
