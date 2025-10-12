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
    price: "Δωρεάν",
    priceId: "price_1SHQMBKs4zHW11KqB8gKpk3u",
    planType: "basic",
    subtitle: "Ιδανικό για απλές εκδηλώσεις",
    features: [
      "1 πρόσκληση",
      "Μέχρι 50 καλεσμένοι",
      "Βασικά templates",
      "Φόρμα RSVP",
      "Χάρτης τοποθεσίας",
      "Βασική gallery",
      "Timeline εκδηλώσεων",
      "Email support",
    ],
  },
  {
    name: "Plus",
    price: "Δωρεάν",
    priceId: "price_1SHQMgKs4zHW11KqBNWaHpMG",
    planType: "plus",
    subtitle: "Για ζευγάρια που θέλουν περισσότερα",
    features: [
      "5 προσκλήσεις",
      "Μέχρι 200 καλεσμένοι",
      "Όλα τα templates",
      "Προχωρημένη gallery",
      "Λίστα δώρων",
      "Διαχείριση καθισμάτων",
      "Εξαγωγή CSV/Excel",
      "Password Protection",
      "Add to Calendar",
      "Email reminders",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "Δωρεάν",
    priceId: "price_1SHQN4Ks4zHW11KqTWZVuObJ",
    planType: "premium",
    subtitle: "Πλήρης έλεγχος & δυνατότητες",
    features: [
      "Απεριόριστες προσκλήσεις",
      "Απεριόριστοι καλεσμένοι",
      "Όλα από Plus +",
      "Live photo wall",
      "Webhook integrations (Zapier/Make)",
      "SMS/WhatsApp reminders",
      "Custom branding",
      "Advanced analytics",
      "Dedicated support",
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

    setLoading(planType);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: { priceId, planType },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
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
                {plan.subtitle && (
                  <p className="text-sm text-muted-foreground mb-3">{plan.subtitle}</p>
                )}
                <div className="text-4xl font-bold mb-1">{plan.price}</div>
                <p className="text-sm text-muted-foreground">/μήνα</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => {
                  const isInclusiveFeature = feature.includes("Όλα από");
                  return (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className={`text-sm ${isInclusiveFeature ? "font-semibold text-primary" : ""}`}>
                        {feature}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan.priceId, plan.planType)}
                disabled={loading === plan.planType}
              >
                {loading === plan.planType ? "Φόρτωση..." : "Ξεκινήστε"}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span>❤️</span>
              <span>30-ημέρες εγγύηση επιστροφής χρημάτων</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔥</span>
              <span>Ασφαλείς πληρωμές</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>Instant setup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
