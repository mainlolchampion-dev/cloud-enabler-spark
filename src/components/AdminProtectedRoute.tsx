import { Navigate } from "react-router-dom";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdminStatus();

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
    toast.error("Δεν έχετε δικαιώματα πρόσβασης στο Admin Dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
