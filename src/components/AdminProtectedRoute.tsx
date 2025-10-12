import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckComplete(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin');

        if (error) {
          console.error('AdminProtectedRoute: Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          const hasAdminRole = data && data.length > 0;
          console.log('AdminProtectedRoute: Admin check result:', { data, hasAdminRole });
          setIsAdmin(hasAdminRole);
        }
      } catch (error) {
        console.error('AdminProtectedRoute: Exception:', error);
        setIsAdmin(false);
      } finally {
        setCheckComplete(true);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Show loading only if auth is loading or we haven't completed the admin check
  if (authLoading || !checkComplete) {
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
    console.log('AdminProtectedRoute: Access denied, isAdmin:', isAdmin);
    toast.error("Δεν έχετε δικαιώματα πρόσβασης στο Admin Dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log('AdminProtectedRoute: Access granted');
  return <>{children}</>;
}
