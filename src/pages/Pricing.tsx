import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const plans = [
  {
    name: "Basic",
    price: "0€",
    priceId: "",
    planType: "basic",
    features: ["1 ενεργό προσκλητήριο", "Βασικά templates", "50 καλεσμένοι max", "Email υποστήριξη"],
  },
  {
    name: "Pro",
    price: "9.99€/μήνα",
    priceId: "price_1SHNxRKs4zHW11Kqk2Rr4ka1",
    planType: "plus",
    features: [
      "5 ενεργά προσκλητήρια",
      "Όλα τα premium templates",
      "Απεριόριστοι καλεσμένοι",
      "SMS ειδοποιήσεις",
      "Προτεραιότητα υποστήριξης",
      "Εξαγωγή guest lists",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "19.99€/μήνα",
    priceId: "price_1SHO06Ks4zHW11KqGlbgMuqc",
    planType: "premium",
    features: [
      "Απεριόριστα προσκλητήρια",
      "Όλα τα premium templates",
      "Απεριόριστοι καλεσμένοι",
      "SMS & Email ειδοποιήσεις",
      "White-label branding",
      "Custom domain",
      "24/7 υποστήριξη",
      "Advanced analytics",
    ],
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (priceId: string, planType: string) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (planType === "basic") {
      navigate("/dashboard");
      return;
    }

    setLoading(planType);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: { priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η δημιουργία της συνεδρίας πληρωμής",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Επιλέξτε το Πλάνο σας</h1>
          <p className="text-muted-foreground text-lg">Ξεκινήστε δωρεάν ή αναβαθμίστε για περισσότερες δυνατότητες</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.planType}
              className={`p-8 relative ${plan.popular ? "border-primary shadow-xl scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Δημοφιλές
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-4">{plan.price}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan.priceId, plan.planType)}
                disabled={loading === plan.planType}
              >
                {loading === plan.planType
                  ? "Φόρτωση..."
                  : plan.planType === "basic"
                    ? "Ξεκινήστε Δωρεάν"
                    : "Επιλογή Πλάνου"}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Όλα τα πλάνα περιλαμβάνουν δωρεάν δοκιμή 14 ημερών. Μπορείτε να ακυρώσετε οποιαδήποτε στιγμή.</p>
        </div>
      </div>
    </div>
  );
}
