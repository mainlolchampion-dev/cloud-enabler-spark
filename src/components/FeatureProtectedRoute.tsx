import { Navigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface FeatureProtectedRouteProps {
  children: React.ReactNode;
  feature: string;
  featureName: string;
  requiredPlan?: "plus" | "premium";
}

export const FeatureProtectedRoute = ({ 
  children, 
  feature, 
  featureName,
  requiredPlan = "plus" 
}: FeatureProtectedRouteProps) => {
  const { hasFeature, loading, getPlanType } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !hasFeature(feature as any)) {
      const planName = requiredPlan === "premium" ? "Premium" : "Plus";
      toast({
        title: "Αναβάθμιση Απαιτείται",
        description: `Το ${featureName} είναι διαθέσιμο μόνο στο πλάνο ${planName} και άνω.`,
        variant: "destructive",
      });
    }
  }, [loading, hasFeature, feature, featureName, requiredPlan, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Φόρτωση...</p>
        </div>
      </div>
    );
  }

  if (!hasFeature(feature as any)) {
    return <Navigate to="/subscription" replace />;
  }

  return <>{children}</>;
};
