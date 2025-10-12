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

  const isLoading = authLoading || subLoading;
  
  console.log("[SUBSCRIPTION-ROUTE] State:", { 
    authLoading, 
    subLoading, 
    isLoading,
    hasUser: !!user,
    hasSubscription: !!subscription,
    subscriptionPlan: subscription?.plan_type
  });

  useEffect(() => {
    if (!isLoading && user && !subscription) {
      console.log("[SUBSCRIPTION-ROUTE] No subscription - showing warning");
      toast({
        title: "Χρειάζεστε Πλάνο",
        description: "Για να δημιουργήσετε προσκλήσεις χρειάζεστε να αγοράσετε ένα πλάνο.",
        variant: "destructive",
      });
    }
  }, [isLoading, user, subscription, toast]);

  if (isLoading) {
    console.log("[SUBSCRIPTION-ROUTE] Still loading...");
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
    console.log("[SUBSCRIPTION-ROUTE] No user - redirect to login");
    return <Navigate to="/login" replace />;
  }

  if (!subscription) {
    console.log("[SUBSCRIPTION-ROUTE] No subscription - redirect to pricing");
    return <Navigate to="/pricing" replace />;
  }

  console.log("[SUBSCRIPTION-ROUTE] Access granted!");
  return <>{children}</>;
};
