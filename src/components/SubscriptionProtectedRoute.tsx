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

  // Show loading spinner while EITHER auth OR subscription is loading
  const isLoading = authLoading || subLoading;
  
  console.log("SubscriptionProtectedRoute check:", { 
    authLoading, 
    subLoading, 
    isLoading,
    hasUser: !!user,
    hasSubscription: !!subscription,
    subscriptionPlan: subscription?.plan_type
  });

  useEffect(() => {
    if (!authLoading && !subLoading && user && !subscription) {
      toast({
        title: "Χρειάζεστε Πλάνο",
        description: "Για να δημιουργήσετε προσκλήσεις χρειάζεστε να αγοράσετε ένα πλάνο.",
        variant: "destructive",
      });
    }
  }, [authLoading, subLoading, user, subscription, toast]);

  // CRITICAL: Wait for BOTH auth AND subscription to finish loading
  if (isLoading) {
    console.log("SubscriptionProtectedRoute: Still loading, showing spinner");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Φόρτωση...</p>
        </div>
      </div>
    );
  }

  // Now that loading is complete, check authentication
  if (!user) {
    console.log("SubscriptionProtectedRoute: No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check subscription
  if (!subscription) {
    console.log("SubscriptionProtectedRoute: No subscription, redirecting to pricing");
    return <Navigate to="/pricing" replace />;
  }

  console.log("SubscriptionProtectedRoute: Access granted", { subscription });
  return <>{children}</>;
};
