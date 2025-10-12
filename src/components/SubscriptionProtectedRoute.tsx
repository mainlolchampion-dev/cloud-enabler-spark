import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface SubscriptionProtectedRouteProps {
  children: React.ReactNode;
}

export const SubscriptionProtectedRoute = ({ children }: SubscriptionProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subLoading } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !subLoading && user && !subscription) {
      toast({
        title: "Χρειάζεστε Πλάνο",
        description: "Για να δημιουργήσετε προσκλήσεις χρειάζεστε να αγοράσετε ένα πλάνο.",
        variant: "destructive",
      });
    }
  }, [authLoading, subLoading, user, subscription, toast]);

  if (authLoading || subLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Φόρτωση...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!subscription) {
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
};
